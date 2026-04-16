import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import '../styles/create-account.css';
import {ReactComponent as Frame} from '../assets/Frame.svg';
import supabase from '../config/databaseClient';

const CreateAccount = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        role: '',
        firstName: '',
        lastName: '',
        gender: '',
        birthDate: '',
        email: '',
        phone: '',
        address: '',
        login: '',
        password: '',
        pricePerSession: '',
        specializations: [],
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSpecializationChange = (value) => {
        setFormData(prev => {
            const exists = prev.specializations.includes(value);

            return {
                ...prev,
                specializations: exists
                    ? prev.specializations.filter(item => item !== value)
                    : [...prev.specializations, value]
            };
        });
    };

    const nextStep = () => {
        if (currentStep === 1) {
            if (!formData.role) {
                return setError("Будь ласка, оберіть тип акаунту.");
            }

            if (!formData.firstName || !formData.lastName || !formData.gender || !formData.birthDate) {
                return setError("Заповніть всі поля цього кроку.");
            }
        }

        if (currentStep === 2) {
            if (formData.role === 'patient') {
                if (!formData.email || !formData.phone || !formData.address) {
                    return setError("Заповніть всі поля цього кроку.");
                }
            }

            if (formData.role === 'doctor') {
                if (!formData.email || !formData.phone || formData.specializations.length === 0) {
                    return setError("Заповніть поля та виберіть хоча б одну спеціалізацію.");
                }
            }
        }

        if (currentStep === 3 && formData.role === 'doctor') {
            if (!formData.login || !formData.password) {
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
            setError("Будь ласка, оберіть тип акаунту.");
            return;
        }

        let genderInEnglish = '';
        if (formData.gender === 'Чоловік') genderInEnglish = 'male';
        else if (formData.gender === 'Жінка') genderInEnglish = 'female';
        else if (formData.gender === 'Інше') genderInEnglish = 'another';

        try {
            if (formData.role === 'patient') {
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

                sessionStorage.setItem("email", formData.email);
                sessionStorage.setItem("patient_id", nextPatientId);
                sessionStorage.setItem("status", "patient");
            } else if (formData.role === 'doctor') {
                const {data: lastDoctor, error: lastDoctorError} = await supabase
                    .from('doctors')
                    .select('doctor_id')
                    .order('doctor_id', {ascending: false})
                    .limit(1);

                if (lastDoctorError) throw lastDoctorError;

                const nextDoctorId = lastDoctor && lastDoctor[0]
                    ? lastDoctor[0].doctor_id + 1
                    : 1;

                const specializationValue = formData.specializations.join(', ');

                const {error: insertError} = await supabase
                    .from('doctors')
                    .insert([
                        {
                            doctor_id: nextDoctorId,
                            first_name: formData.firstName,
                            last_name: formData.lastName,
                            specialization: specializationValue,
                            experience: null,
                            price_per_session: formData.pricePerSession
                                ? Number(formData.pricePerSession)
                                : null,
                            phone_number: formData.phone,
                            email: formData.email,
                            doc_login: formData.login,
                            doc_password: formData.password,
                            meet_fomat: null,
                            city: null,
                            doc_photo: null,
                            doc_sex: genderInEnglish,
                            doc_date: formData.birthDate,
                            doc_session: 0,
                            doc_rev: 0,
                            doc_lang: null,
                            doc_about: null,
                            doc_education: null,
                            doc_way: null,
                        }
                    ]);

                if (insertError) throw insertError;

                sessionStorage.setItem("email", formData.email);
                sessionStorage.setItem("doctor_id", nextDoctorId);
                sessionStorage.setItem("status", "doctor");
            }

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
                                <p>Оберіть свою стать:</p>

                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Чоловік"
                                        checked={formData.gender === 'Чоловік'}
                                        onChange={handleChange}
                                    />
                                    Чоловік
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Жінка"
                                        checked={formData.gender === 'Жінка'}
                                        onChange={handleChange}
                                    />
                                    Жінка
                                </label>

                                <label>
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="Інше"
                                        checked={formData.gender === 'Інше'}
                                        onChange={handleChange}
                                    />
                                    Інше
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

                            {formData.role === 'patient' && (
                                <div className="input-container">
                                    <input
                                        type="text"
                                        placeholder="Адреса"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                            )}

                            {formData.role === 'doctor' && (
                                <div className="input-container">
                                    <p>Спеціалізація:</p>

                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.specializations.includes('Психолог')}
                                            onChange={() => handleSpecializationChange('Психолог')}
                                        />
                                        Психолог
                                    </label>

                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.specializations.includes('Психіатр')}
                                            onChange={() => handleSpecializationChange('Психіатр')}
                                        />
                                        Психіатр
                                    </label>

                                    <label>
                                        <input
                                            type="checkbox"
                                            checked={formData.specializations.includes('Психотерапевт')}
                                            onChange={() => handleSpecializationChange('Психотерапевт')}
                                        />
                                        Психотерапевт
                                    </label>
                                </div>
                            )}

                            <button type="button" className="prev-button" onClick={prevStep}>
                                Назад
                            </button>
                            <button type="button" className="login-button" onClick={nextStep}>
                                Далі
                            </button>
                        </>
                    )}

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