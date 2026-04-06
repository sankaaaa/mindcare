import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/create-account.css';
import {ReactComponent as Frame} from '../assets/Frame.svg';
import supabase from '../config/databaseClient';

const CreateAccount = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        role: '',          // 'patient' або 'doctor'
        firstName: '',
        lastName: '',
        gender: '',
        birthDate: '',
        email: '',
        phone: '',
        address: '',
        login: '',
        password: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const nextStep = () => {
        // мінімальна валідація по кроках
        if (currentStep === 1) {
            if (!formData.role) {
                return setError("Будь ласка, оберіть тип акаунту.");
            }
            if (!formData.firstName || !formData.lastName || !formData.gender || !formData.birthDate) {
                return setError("Заповніть всі поля цього кроку.");
            }
        }
        if (currentStep === 2) {
            if (!formData.email || !formData.phone || !formData.address) {
                return setError("Заповніть всі поля цього кроку.");
            }
        }

        setError('');
        setCurrentStep((prevStep) => prevStep + 1);
    };

    const prevStep = () => {
        setError('');
        setCurrentStep((prevStep) => prevStep - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.role) {
            setError("Будь ласка, оберіть тип акаунту (студент чи спеціаліст).");
            return;
        }

        let genderInEnglish = '';
        if (formData.gender === 'male') genderInEnglish = 'male';
        else if (formData.gender === 'female') genderInEnglish = 'female';
        else if (formData.gender === 'another') genderInEnglish = 'another';

        try {
            if (formData.role === 'patient') {
                // ===== РЕЄСТРАЦІЯ СТУДЕНТА =====
                const {data: lastPatient, error: lastPatientError} = await supabase
                    .from('patients')
                    .select('patient_id')
                    .order('patient_id', {ascending: false})
                    .limit(1);

                if (lastPatientError) throw lastPatientError;

                const nextPatientId = lastPatient && lastPatient[0]
                    ? lastPatient[0].patient_id + 1
                    : 1;

                const {error: insertError} = await supabase
                    .from('patients')
                    .insert([
                        {
                            patient_id: nextPatientId,
                            first_name: formData.firstName,
                            last_name: formData.lastName,
                            date_of_birth: formData.birthDate,
                            gender: genderInEnglish,
                            email: formData.email,
                            phone_number: formData.phone,
                            address: formData.address,
                            pat_login: formData.login,
                            pat_password: formData.password,
                        }
                    ]);

                if (insertError) throw insertError;

                // Зберігаємо ідентифікатори в sessionStorage
                sessionStorage.setItem("email", formData.email);
                sessionStorage.setItem("patient_id", nextPatientId);
                sessionStorage.setItem("status", "patient");

            } else if (formData.role === 'doctor') {
                // ===== РЕЄСТРАЦІЯ СПЕЦІАЛІСТА =====
                const {data: lastDoctor, error: lastDoctorError} = await supabase
                    .from('doctors')
                    .select('doctor_id')
                    .order('doctor_id', {ascending: false})
                    .limit(1);

                if (lastDoctorError) throw lastDoctorError;

                const nextDoctorId = lastDoctor && lastDoctor[0]
                    ? lastDoctor[0].doctor_id + 1
                    : 1;

                const {error: insertError} = await supabase
                    .from('doctors')
                    .insert([
                        {
                            doctor_id: nextDoctorId,
                            first_name: formData.firstName,
                            last_name: formData.lastName,
                            email: formData.email,
                            phone_number: formData.phone,
                            city: formData.address,
                            doc_login: formData.login,
                            doc_password: formData.password,
                            doc_sex: genderInEnglish,
                            doc_date: formData.birthDate,
                            // інші поля (specialization, meet_fomat і т.д.) можна редагувати пізніше в кабінеті
                        }
                    ]);

                if (insertError) throw insertError;

                sessionStorage.setItem("email", formData.email);
                sessionStorage.setItem("doctor_id", nextDoctorId);
                sessionStorage.setItem("status", "doctor");
            }

            // Спроба надіслати вітальний лист (не ламаємо реєстрацію, якщо лист не відправився)
            try {
                await fetch("http://localhost:4000/send-registration-email", {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        email: formData.email,
                        name: formData.firstName
                    })
                });
            } catch (mailErr) {
                console.error("Помилка відправки реєстраційного листа:", mailErr);
            }

            navigate('/login');
        } catch (error) {
            console.error('Помилка при створенні акаунту:', error);
            setError('Помилка при створенні акаунту: ' + (error.message || 'невідома помилка'));
        }
    };


    return (
        <div className="createacc-page">
            <div className="logo">
                <Frame className="frameIcon"/>
                <div className="logoText">MindCare</div>
            </div>

            <div className="createacc-container">
                <div className="header">
                    <h2>Створити акаунт</h2>
                    <p>Будь ласка, заповніть необхідні поля</p>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* КРОК 1 */}
                    {currentStep === 1 && (
                        <>
                            <div className="input-container">
                                <p>Оберіть тип акаунту:</p>

                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="patient"
                                        checked={formData.role === 'patient'}
                                        onChange={handleChange}
                                    />
                                    Пацієнт
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="role"
                                        value="doctor"
                                        checked={formData.role === 'doctor'}
                                        onChange={handleChange}
                                    />
                                    Спеціаліст
                                </label>
                            </div>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Ім'я"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Прізвище"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-container">
                                <p>Оберіть свою стать: </p>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="gender"
                                        checked={formData.gender === 'male'}
                                        onChange={() => setFormData({...formData, gender: 'male'})}
                                    />
                                    Чоловік
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="gender"
                                        checked={formData.gender === 'female'}
                                        onChange={() => setFormData({...formData, gender: 'female'})}
                                    />
                                    Жінка
                                </label>
                                <label>
                                    <input
                                        type="checkbox"
                                        name="gender"
                                        checked={formData.gender === 'another'}
                                        onChange={() => setFormData({...formData, gender: 'another'})}
                                    />
                                    Інша
                                </label>
                            </div>

                            <div className="input-container">
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="button" className="login-button" onClick={nextStep}>
                                Далі
                            </button>
                        </>
                    )}

                    {/* КРОК 2 */}
                    {currentStep === 2 && (
                        <>
                            <div className="input-container">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Телефон"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Адреса"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="button" className="prev-button" onClick={prevStep}>
                                Назад
                            </button>
                            <button type="button" className="login-button" onClick={nextStep}>
                                Далі
                            </button>
                        </>
                    )}

                    {/* КРОК 3 */}
                    {currentStep === 3 && (
                        <>
                            <div className="input-container">
                                <input
                                    type="text"
                                    placeholder="Логін"
                                    name="login"
                                    value={formData.login}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="input-container">
                                <input
                                    type="password"
                                    placeholder="Пароль"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>

                            <button type="button" className="prev-button" onClick={prevStep}>
                                Назад
                            </button>
                            <button type="submit" className="login-button">
                                Завершити
                            </button>
                        </>
                    )}
                </form>

                {error && <div className="error">{error}</div>}
            </div>

            <div className="pattern"></div>
        </div>
    );
};

export default CreateAccount;
