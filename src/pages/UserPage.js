import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import supabase from '../config/databaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/loader.css';
import '../styles/user-page.css';

const UserPage = () => {
    const [patientData, setPatientData] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('general');
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();
    const storedPatientId = sessionStorage.getItem('patient_id');

    useEffect(() => {
        fetchPatientData();
        fetchAppointments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchPatientData = async () => {
        const {data, error} = await supabase
            .from('patients')
            .select('first_name, last_name, date_of_birth, gender, email, phone_number, address')
            .eq('patient_id', storedPatientId)
            .single();

        if (error) {
            console.error('Помилка завантаження даних:', error.message);
            alert('Не вдалося завантажити дані пацієнта.');
        } else {
            setPatientData(data);
        }
    };

    const fetchAppointments = async () => {
        const {data, error} = await supabase
            .from('times')
            .select('doctor_id, date')
            .eq('patient', storedPatientId);

        if (error) {
            console.error('Помилка завантаження записів:', error.message);
            return;
        }

        if (!data || data.length === 0) {
            setAppointments([]);
            return;
        }

        const appointmentsWithNames = await Promise.all(
            data.map(async (appointment) => {
                const {data: doctorData} = await supabase
                    .from('doctors')
                    .select('first_name, last_name, email')
                    .eq('doctor_id', appointment.doctor_id)
                    .single();

                return {
                    ...appointment,
                    doctor_name: `${doctorData.first_name} ${doctorData.last_name}`,
                    doctor_email: doctorData.email
                };
            })
        );

        setAppointments(appointmentsWithNames);
    };

    const handleTabChange = (tab) => setActiveTab(tab);

    const handleChange = (field, value) => {
        setPatientData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const saveChanges = async () => {
        const {error} = await supabase
            .from('patients')
            .update({
                first_name: patientData.first_name,
                last_name: patientData.last_name,
                date_of_birth: patientData.date_of_birth,
                gender: patientData.gender,
                email: patientData.email,
                phone_number: patientData.phone_number,
                address: patientData.address
            })
            .eq('patient_id', storedPatientId);

        if (error) {
            alert("Помилка збереження");
            console.error(error);
        } else {
            alert("Дані оновлено");
        }
    };

    const handleBookSession = () => navigate('/all-therapists');

    const cancelAppointment = async (appointment) => {
        try {
            console.log("=== CANCEL APPOINTMENT START ===");
            console.log("appointment:", appointment);

            // 1) Зняти бронь у times
            const { error: updateError } = await supabase
                .from('times')
                .update({ patient: null, is_booked: false })
                .eq('doctor_id', appointment.doctor_id)
                .eq('date', appointment.date);

            console.log("supabase update result error:", updateError);

            if (updateError) {
                console.error("Supabase update error:", updateError);
                throw updateError;          // піде в catch
            }

            // 2) Отримати дані пацієнта
            const { data: patient, error: patientError } = await supabase
                .from('patients')
                .select('first_name, last_name, email')
                .eq('patient_id', storedPatientId)
                .single();

            if (patientError) {
                console.error("patientError:", patientError);
                throw patientError;
            }

            // 3) Дані лікаря вже є в appointment (doctor_name, doctor_email)
            const doctorName = appointment.doctor_name;
            const doctorEmail = appointment.doctor_email;

            const dateObj = new Date(appointment.date);
            const dateStr = dateObj.toLocaleDateString();
            const timeStr = dateObj.toLocaleTimeString();

            console.log("dateStr/timeStr:", dateStr, timeStr);

            // 4) Лист пацієнту (підтвердження скасування)
            const cancelRes = await fetch("http://localhost:4000/send-cancel-email", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: patient.email,
                    therapistName: doctorName,
                    date: dateStr,
                    time: timeStr
                })
            });

            console.log("send-cancel-email status:", cancelRes.status);

            if (!cancelRes.ok) {
                const t = await cancelRes.text();
                console.error("send-cancel-email response not ok:", t);
                throw new Error("send-cancel-email failed");
            }

            // 5) Лист лікарю про скасування
            const therapistCancelRes = await fetch("http://localhost:4000/send-therapist-cancel", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({
                    email: doctorEmail,
                    patientName: `${patient.first_name} ${patient.last_name}`,
                    date: dateStr,
                    time: timeStr
                })
            });

            console.log("send-therapist-cancel status:", therapistCancelRes.status);

            if (!therapistCancelRes.ok) {
                const t = await therapistCancelRes.text();
                console.error("send-therapist-cancel response not ok:", t);
                throw new Error("send-therapist-cancel failed");
            }

            // 6) Прибрати запис із списку
            setAppointments(prev =>
                prev.filter(a => !(a.doctor_id === appointment.doctor_id && a.date === appointment.date))
            );

            alert('Запис скасовано. Листи надіслані.');
            console.log("=== CANCEL APPOINTMENT END OK ===");
        } catch (err) {
            console.error('Помилка скасування (catch):', err);
            alert('Не вдалося скасувати запис. Спробуйте пізніше.');
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Ви впевнені, що хочете видалити обліковий запис? Цю дію не можна скасувати.")) {
            return;
        }

        try {
            // 1. Звільняємо всі записи цього пацієнта (щоб не висіли заброньованими)
            await supabase
                .from('times')
                .update({ patient: null, is_booked: false })
                .eq('patient', storedPatientId);

            // 2. Видаляємо самого пацієнта
            const { error } = await supabase
                .from('patients')
                .delete()
                .eq('patient_id', storedPatientId);

            if (error) {
                console.error("Помилка видалення пацієнта:", error);
                alert("Не вдалося видалити обліковий запис. Спробуйте пізніше.");
                return;
            }

            // 3. Чистимо sessionStorage
            sessionStorage.removeItem('status');
            sessionStorage.removeItem('patient_id');
            sessionStorage.removeItem('doctor_id');
            sessionStorage.removeItem('email');

            // 4. Перекидаємо на логін
            alert("Обліковий запис успішно видалено.");
            navigate('/login');
        } catch (err) {
            console.error("Помилка при видаленні акаунту:", err);
            alert("Не вдалося видалити обліковий запис. Спробуйте пізніше.");
        }
    };


    return (
        <>
            <Header/>
            <main>
                {patientData ? (
                    <div>

                        <div className="mydict-doc">
                            <div className="lol">
                                <label>
                                    <input
                                        type="radio"
                                        name="radio"
                                        checked={activeTab === 'general'}
                                        onChange={() => handleTabChange('general')}
                                    />
                                    <span>Мої дані</span>
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="radio"
                                        checked={activeTab === 'appointments'}
                                        onChange={() => handleTabChange('appointments')}
                                    />
                                    <span>Мої записи</span>
                                </label>
                            </div>

                            <div className="edit-btn-container">
                                <button
                                    className="edit-btn"
                                    onClick={() => {
                                        if (isEditing) saveChanges();
                                        setIsEditing(!isEditing);
                                    }}
                                >
                                    {isEditing ? "Зберегти" : "Редагувати"}
                                </button>
                            </div>
                        </div>

                        {/* ------------------- ВКЛАДКА: Мої дані ------------------- */}
                        {activeTab === 'general' && (
                            <div className="card-doc">

                                <section className="section-doc">
                                    <h2 className="section-title">Особиста інформація</h2>

                                    <p className="info-item">
                                        <span className="info-label">Ім'я:</span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={patientData.first_name}
                                                onChange={(e) => handleChange("first_name", e.target.value)}
                                            />
                                        ) : patientData.first_name}
                                    </p>

                                    <p className="info-item">
                                        <span className="info-label">Прізвище:</span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={patientData.last_name}
                                                onChange={(e) => handleChange("last_name", e.target.value)}
                                            />
                                        ) : patientData.last_name}
                                    </p>

                                    <p className="info-item">
                                        <span className="info-label">Дата народження:</span>
                                        {isEditing ? (
                                            <input
                                                type="date"
                                                value={patientData.date_of_birth}
                                                onChange={(e) => handleChange("date_of_birth", e.target.value)}
                                            />
                                        ) : patientData.date_of_birth}
                                    </p>

                                    <p className="info-item">
                                        <span className="info-label">Стать:</span>
                                        {isEditing ? (
                                            <select
                                                value={patientData.gender}
                                                onChange={(e) => handleChange("gender", e.target.value)}
                                            >
                                                <option value="male">Чоловік</option>
                                                <option value="female">Жінка</option>
                                                <option value="another">Інша</option>
                                            </select>
                                        ) : patientData.gender}
                                    </p>
                                </section>

                                <section className="section-doc">
                                    <h2 className="section-title">Контактні дані</h2>

                                    <p className="info-item">
                                        <span className="info-label">Email:</span>
                                        {isEditing ? (
                                            <input
                                                type="email"
                                                value={patientData.email}
                                                onChange={(e) => handleChange("email", e.target.value)}
                                            />
                                        ) : patientData.email}
                                    </p>

                                    <p className="info-item">
                                        <span className="info-label">Телефон:</span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={patientData.phone_number}
                                                onChange={(e) => handleChange("phone_number", e.target.value)}
                                            />
                                        ) : patientData.phone_number}
                                    </p>

                                    <p className="info-item">
                                        <span className="info-label">Адреса:</span>
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                value={patientData.address}
                                                onChange={(e) => handleChange("address", e.target.value)}
                                            />
                                        ) : patientData.address}
                                    </p>

                                </section>

                            </div>
                        )}

                        {/* ------------------- ВКЛАДКА: Мої записи ------------------- */}
                        {activeTab === 'appointments' && (
                            <div className="app-section-content-doc">
                                <div className="card-two">
                                    <section className="section">
                                        <h2 className="section-title">Мої записи</h2>

                                        {appointments.length > 0 ? (
                                            appointments.map((appointment, index) => (
                                                <div key={index} className="appointment-item">
                                                    <p>
                                                        <span className="info-label">Спеціаліст:</span> {appointment.doctor_name}
                                                    </p>
                                                    <p>
                                                        <span className="info-label">Дата і час:</span> {new Date(appointment.date).toLocaleString()}
                                                    </p>
                                                    <button
                                                        className="cancel-btn"
                                                        onClick={() => cancelAppointment(appointment)}
                                                    >
                                                        Скасувати
                                                    </button>
                                                </div>
                                            ))
                                        ) : (
                                            <div>
                                                <p>У вас немає записів.</p>
                                                <button className="book-session-btn" onClick={handleBookSession}>
                                                    Забронювати сеанс
                                                </button>
                                            </div>
                                        )}

                                    </section>
                                </div>
                            </div>
                        )}

                        <div className="delete-account-wrapper">
                            <button
                                className="delete-account-btn"
                                onClick={handleDeleteAccount}
                            >
                                Видалити обліковий запис
                            </button>
                        </div>

                        <Footer/>

                    </div>
                ) : (
                    <div className="banter-loader">
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                        <div className="banter-loader__box"></div>
                    </div>
                )}
            </main>
        </>
    );
};

export default UserPage;
