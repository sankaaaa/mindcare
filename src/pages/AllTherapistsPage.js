import React, {useState, useEffect} from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import TherapistCard from "../components/TherapistCard";
import "../styles/therapists-page.css";
import supabase from '../config/databaseClient';
import FilterComponent from '../components/FilterComponent';
import SpecializationFilter from "../components/SpecializationFilter";
import GenderFilter from "../components/GenderFilter";
import MeetFormatFilter from "../components/MeetFormatFilter";
import '../styles/loader.css';

const AllTherapistsPage = () => {
    const [therapists, setTherapists] = useState([]);
    const [categories, setCategories] = useState([]);
    const [specializations, setSpecializations] = useState([]);
    const [selectedSpecializations, setSelectedSpecializations] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedGender, setSelectedGender] = useState([]);
    const [selectedMeetFormat, setSelectedMeetFormat] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                const {data: doctors, error: doctorsError} = await supabase
                    .from('doctors')
                    .select('doctor_id, first_name, last_name, specialization, experience, meet_fomat, city, doc_photo, doc_sex');

                if (doctorsError) throw doctorsError;

                const {data: doctorCategories, error: doctorCategoriesError} = await supabase
                    .from('doctor_categories')
                    .select('doctor_id, category_id');

                if (doctorCategoriesError) throw doctorCategoriesError;

                const {data: categoriesData, error: categoriesError} = await supabase
                    .from('categories')
                    .select('category_id, name');

                if (categoriesError) throw categoriesError;

                setCategories(categoriesData || []);

                const categoryMap = {};
                categoriesData.forEach(category => {
                    categoryMap[category.category_id] = category.name;
                });

                const availableSpecializations = ['Психолог', 'Психіатр', 'Психотерапевт'];
                setSpecializations(availableSpecializations);

                const formatExperience = (years) => {
                    const lastDigit = years % 10;
                    const lastTwoDigits = years % 100;

                    if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
                        return `${years} років`;
                    }

                    if (lastDigit === 1) {
                        return `${years} рік`;
                    }

                    if (lastDigit >= 2 && lastDigit <= 4) {
                        return `${years} роки`;
                    }

                    return `${years} років`;
                };

                const formattedTherapists = doctors.map(doctor => {
                    const doctorSpecialties = doctorCategories
                        .filter(dc => dc.doctor_id === doctor.doctor_id)
                        .map(dc => ({
                            id: dc.category_id,
                            name: categoryMap[dc.category_id],
                        }))
                        .sort((a, b) => a.id - b.id)
                        .map(category => category.name);

                    const professions = doctor.specialization
                        ? doctor.specialization.split(',').map(prof => prof.trim())
                        : [];

                    const meetFormat = doctor.meet_fomat || 'Формат не вказано';
                    const city = doctor.city || '';
                    const gender = doctor.doc_sex || 'Не вказано';
                    const photo = doctor.doc_photo || '';

                    let location = meetFormat;
                    if (meetFormat.includes('Офлайн') && city) {
                        location = meetFormat.replace('Офлайн', `Офлайн: ${city}`);
                    }

                    return {
                        doctor_id: doctor.doctor_id,
                        name: `${doctor.first_name} ${doctor.last_name}`,
                        experience: doctor.experience ? formatExperience(doctor.experience) : 'Досвід не вказано',
                        location,
                        professions,
                        specialties: doctorSpecialties,
                        photo,
                        gender,
                        meetFormat,
                    };
                });

                formattedTherapists.sort((a, b) => a.doctor_id - b.doctor_id);
                setTherapists(formattedTherapists);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleFilter = (selected) => {
        setSelectedCategories(selected);
    };

    const handleSpecializationFilter = (selectedSpecializations) => {
        setSelectedSpecializations(selectedSpecializations);
    };

    const handleGenderFilter = (selectedGender) => {
        setSelectedGender(selectedGender);
    };

    const handleMeetFormatFilter = (selectedMeetFormat) => {
        setSelectedMeetFormat(selectedMeetFormat);
    };

    const filteredTherapists = therapists.filter(therapist =>
        (selectedCategories.length === 0 || therapist.specialties.some(specialty => selectedCategories.includes(specialty))) &&
        (selectedSpecializations.length === 0 || therapist.professions.some(prof => selectedSpecializations.includes(prof))) &&
        (selectedGender.length === 0 ||
            selectedGender.includes('Не важливо') ||
            selectedGender.includes(therapist.gender || '')) &&
        (selectedMeetFormat.length === 0 ||
            selectedMeetFormat.includes('Не важливо') ||
            selectedMeetFormat.includes(therapist.meetFormat || '')) &&
        therapist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="all-therapists-container">
            <Header/>
            <div className="filters">
                <FilterComponent categories={categories} onFilter={handleFilter}/>
                <SpecializationFilter specializations={specializations}
                                      onFilterSpecialization={handleSpecializationFilter}/>
                <GenderFilter onFilterGender={handleGenderFilter}/>
                <MeetFormatFilter onFilterMeetFormat={handleMeetFormatFilter}/>
                <input
                    type="text"
                    placeholder="Пошук"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            {loading ? (
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
            ) : (
                <div>
                    <div className="cards-container">
                        {filteredTherapists.map((therapist, index) => (
                            <TherapistCard key={index} {...therapist} />
                        ))}
                    </div>
                    <Footer/>
                </div>
            )}
        </div>
    );
};

export default AllTherapistsPage;
