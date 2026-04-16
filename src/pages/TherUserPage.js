import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import supabase from '../config/databaseClient';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/loader.css';
import '../styles/user-page.css';
import Appointments from "../components/Appointments";
import DoctorSlotsManager from "../components/DoctorSlotsManager";

const TherUserPage = () => {
    const { doctor_id } = useParams();
    const navigate = useNavigate();

    const storedDoctorId = sessionStorage.getItem('doctor_id');
    const resolvedDoctorId = storedDoctorId || doctor_id;

    const [doctorData, setDoctorData] = useState(null);
    const [activeTab, setActiveTab] = useState(() => {
        return sessionStorage.getItem('therapist_active_tab') || 'general';
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editedDoctor, setEditedDoctor] = useState({});

    useEffect(() => {
        sessionStorage.setItem('therapist_active_tab', activeTab);
    }, [activeTab]);

    useEffect(() => {
        const fetchDoctorData = async () => {
            if (!resolvedDoctorId) {
                console.error('Doctor ID не знайдено ні в sessionStorage, ні в URL');
                alert('Не вдалося завантажити дані лікаря.');
                return;
            }

            const {data, error} = await supabase
                .from('doctors')
                .select(
                    'doctor_id, first_name, last_name, specialization, experience, email, phone_number, ' +
                    'meet_fomat, city, doc_sex, doc_date, doc_session, doc_rev, doc_lang, doc_education, doc_way, doc_photo'
                )
                .eq('doctor_id', Number(resolvedDoctorId))
                .single();

            if (error) {
                console.error('Помилка завантаження даних:', error);
                alert('Не вдалося завантажити дані лікаря.');
            } else {
                setDoctorData(data);
                setEditedDoctor(data);
            }
        };

        fetchDoctorData();
    }, [resolvedDoctorId]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const saveChanges = async () => {
        try {
            const { error } = await supabase
                .from("doctors")
                .update({
                    ...editedDoctor
                })
                .eq("doctor_id", Number(resolvedDoctorId));

            if (error) {
                alert("Помилка при збереженні: " + error.message);
            } else {
                alert("Зміни збережено!");
                setDoctorData(editedDoctor);
                setIsEditing(false);
            }
        } catch (e) {
            console.error(e);
            alert("Сталася помилка при збереженні.");
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm("Ви впевнені, що хочете видалити обліковий запис спеціаліста? Цю дію не можна скасувати.")) {
            return;
        }

        try {
            await supabase
                .from('times')
                .delete()
                .eq('doctor_id', Number(resolvedDoctorId));

            const { error } = await supabase
                .from('doctors')
                .delete()
                .eq('doctor_id', Number(resolvedDoctorId));

            if (error) {
                console.error("Помилка видалення лікаря:", error);
                alert("Не вдалося видалити обліковий запис. Спробуйте пізніше.");
                return;
            }

            sessionStorage.removeItem('status');
            sessionStorage.removeItem('patient_id');
            sessionStorage.removeItem('doctor_id');
            sessionStorage.removeItem('email');
            sessionStorage.removeItem('therapist_active_tab');

            sessionStorage.removeItem('status');
            sessionStorage.removeItem('patient_id');
            sessionStorage.removeItem('doctor_id');

            alert("Обліковий запис спеціаліста успішно видалено.");
            navigate('/login');
        } catch (err) {
            console.error("Помилка при видаленні акаунту лікаря:", err);
            alert("Не вдалося видалити обліковий запис. Спробуйте пізніше.");
        }
    };

    return (
        <>
            <Header/>
            <main>
                {doctorData ? (
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
                                    <span>Загальна інформація</span>
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
                                    type="button"
                                    className="edit-btn"
                                    onClick={() => {
                                        if (isEditing) {
                                            saveChanges();
                                        } else {
                                            setIsEditing(true);
                                        }
                                    }}
                                >
                                    {isEditing ? "Зберегти" : "Редагувати"}
                                </button>
                            </div>

                            {activeTab === 'general' && (
                                <div className="card-doc">
                                    <section id="gen-ttl" className="section-doc">
                                        <h2 className="section-title">Загальна інформація</h2>

                                        <p className="info-item">
                                            <span className="info-label">Ім'я:</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedDoctor.first_name || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, first_name: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.first_name}
                                        </p>

                                        <p className="info-item">
                                            <span className="info-label">Прізвище:</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedDoctor.last_name || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, last_name: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.last_name}
                                        </p>

                                        <p className="info-item">
                                            <span className="info-label">Кваліфікація:</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedDoctor.specialization || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, specialization: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.specialization}
                                        </p>

                                        <p className="info-item">
                                            <span className="info-label">Досвід роботи:</span>
                                            {isEditing ? (
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={editedDoctor.experience || 0}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, experience: Number(e.target.value)})
                                                    }
                                                />
                                            ) : `${doctorData.experience} років`}
                                        </p>

                                        <p className="info-item">
                                            <span className="info-label">Стать:</span>
                                            {isEditing ? (
                                                <select
                                                    value={editedDoctor.doc_sex || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, doc_sex: e.target.value})
                                                    }
                                                >
                                                    <option value="Чоловік">Чоловік</option>
                                                    <option value="Жінка">Жінка</option>
                                                    <option value="Інше">Інше</option>
                                                </select>
                                            ) : doctorData.doc_sex}
                                        </p>

                                        <p className="info-item">
                                            <span className="info-label">Дата народження:</span>
                                            {isEditing ? (
                                                <input
                                                    type="date"
                                                    value={editedDoctor.doc_date?.substring(0, 10) || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, doc_date: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.doc_date}
                                        </p>
                                    </section>

                                    <section className="section-doc">
                                        <img src={doctorData.doc_photo} alt="doctor" className="doc-photo"/>
                                    </section>

                                    <section className="section-doc">
                                        <h2 className="section-title">Контактні дані</h2>

                                        <p className="info-item">
                                            <span className="info-label">Email:</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedDoctor.email || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, email: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.email}
                                        </p>

                                        <p className="info-item">
                                            <span className="info-label">Телефон:</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedDoctor.phone_number || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, phone_number: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.phone_number}
                                        </p>

                                        <p className="info-item">
                                            <span className="info-label">Формат зустрічі:</span>
                                            {isEditing ? (
                                                <select
                                                    value={editedDoctor.meet_fomat || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, meet_fomat: e.target.value})
                                                    }
                                                >
                                                    <option value="Онлайн">Онлайн</option>
                                                    <option value="Офлайн">Офлайн</option>
                                                </select>
                                            ) : doctorData.meet_fomat}
                                        </p>

                                        <p className="info-item">
                                            <span className="info-label">Місто:</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedDoctor.city || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, city: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.city}
                                        </p>
                                    </section>

                                    <section className="section-doc">
                                        <h2 className="section-title">Професійна інформація</h2>

                                        <p className="info-item">
                                            <span className="info-label">Сесії:</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedDoctor.doc_session || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, doc_session: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.doc_session}
                                        </p>

                                        <p className="info-item">
                                            <span className="info-label">Рев'ю:</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedDoctor.doc_rev || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, doc_rev: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.doc_rev}
                                        </p>

                                        <p className="info-item">
                                            <span className="info-label">Мови:</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedDoctor.doc_lang || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, doc_lang: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.doc_lang}
                                        </p>
                                    </section>

                                    <section className="section-doc">
                                        <h2 className="section-title">Освіта</h2>
                                        <p className="info-item">
                                            <span className="info-label">Освіта:</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedDoctor.doc_education || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, doc_education: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.doc_education}
                                        </p>
                                    </section>

                                    <section className="section-doc">
                                        <h2 className="section-title">Додаткова інформація</h2>
                                        <p className="info-item">
                                            <span className="info-label">Підхід:</span>
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={editedDoctor.doc_way || ""}
                                                    onChange={(e) =>
                                                        setEditedDoctor({...editedDoctor, doc_way: e.target.value})
                                                    }
                                                />
                                            ) : doctorData.doc_way}
                                        </p>
                                    </section>
                                </div>
                            )}

                            {activeTab === 'appointments' && (
                                <div className="app-section-content-doc">
                                    <div className="slots-manager-wrapper">
                                        <DoctorSlotsManager doctorId={resolvedDoctorId} />
                                    </div>

                                    <div className="appointments-wrapper">
                                        <Appointments doctorId={resolvedDoctorId} />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="delete-account-wrapper">
                            <button
                                type="button"
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

export default TherUserPage;