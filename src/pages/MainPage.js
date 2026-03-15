import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/main_style.css';
import {Button, Accordion, AccordionItem} from "@nextui-org/react";
import mainImage from '../assets/main.png';
import Frame from '../assets/Frame.svg';
import block3img from '../assets/block3.png'
import {useNavigate} from 'react-router-dom';


const MainPage = () => {
    const navigate = useNavigate();

    const handleAllTherapists = () => {
        navigate('/all-therapists');
    };

    const handleFindTherapist = () => {
        navigate('/find-therapist');
    };

    return (
        <div className="main-container">
            <Header/>
            <div className="content">
                <img
                    className="placeholder-image"
                    src={mainImage}
                    alt="Placeholder"
                />

                <div className="text-section">
                    <h1 className="main-title">
                        Знайдіть спеціаліста, який Вас підтримає
                    </h1>

                    <p className="main-description">
                        Ви не самотні. Ми тут, щоб надати необхідну підтримку та допомогу.
                    </p>

                    <div className="button-group">
                        <Button onPress={handleFindTherapist} className="primary-button">
                            Підібрати фахівця
                        </Button>

                        <span className="separator">або</span>

                        <Button onPress={handleAllTherapists} className="secondary-button">
                            Усі фахівці
                        </Button>
                    </div>
                </div>
            </div>


            <div id="stats-block" className="stats-block">
                <div className="stat-item stat-item-1">
                    <span className="stat-value">50 000+</span>
                    <span className="stat-descriptiona">сесій проведено</span>
                </div>
                <div className="stat-item stat-item-2">
                    <span className="stat-value">97%</span>
                    <span className="stat-descriptiona">позитивних відгуків</span>
                </div>
                <div className="stat-item stat-item-3">
                    <span className="stat-value">3хв</span>
                    <span className="stat-descriptiona">час пошуку фахівця</span>
                </div>
                <div className="stat-item stat-item-4">
                    <span className="stat-value">200+</span>
                    <span className="stat-descriptiona">перевірених фахівців</span>
                </div>
            </div>


            <div className="text-green text-5xl font-semibold stat-title">
                Тільки 3% спеціалістів проходять відбір
            </div>
            <div className="block3">
                <div className="content-container">

                    <div className="stat-texts">
                        <div className="stat-subtitle-container">
                            <img className="stat-subtitle-icon" src={Frame} alt="text"/>
                            <div className="text-green text-4xl font-semibold stat-subtitle">
                                Освіта та досвід
                            </div>
                        </div>

                        <div className="text-green text-lg font-semibold stat-description">
                            Усі фахівці мають вищу психологічну або медичну освіту, а також додаткові сертифікації у
                            сучасних терапевтичних підходах, спрямованих на роботу з військовими, ветеранами та людьми,
                            які пережили травматичний досвід війни. Багато спеціалістів мають досвід роботи з посттравматичним
                            стресовим розладом (ПТСР), кризовими станами, втратами та психологічною адаптацією після
                            бойових дій.
                        </div>

                        <div className="stat-subtitle-container">
                            <img className="stat-subtitle-icon" src={Frame} alt="text"/>
                            <div className="text-green text-4xl font-semibold stat-subtitle">
                                Підвищення кваліфікації
                            </div>
                        </div>

                        <div className="text-green text-base font-semibold stat-description">
                            Ми перевіряємо належність фахівців до професійних психологічних і медичних асоціацій, а
                            також їхню участь у програмах підвищення кваліфікації. Наші спеціалісти регулярно проходять
                            навчання з травматерапії, кризової психології, роботи з ПТСР та реабілітації військових.
                            Багато з них також володіють додатковими напрямами — кризовим консультуванням, сімейною
                            терапією, психологічною підтримкою ветеранів та їхніх родин.
                        </div>

                        <div className="stat-subtitle-container">
                            <img className="stat-subtitle-icon" src={Frame} alt="text"/>
                            <div className="text-green text-4xl font-semibold stat-subtitle">
                                Співбесіда та випробувальний термін
                            </div>
                        </div>

                        <div className="text-green text-base font-semibold stat-description">
                            Кожен спеціаліст проходить особисту співбесіду та випробувальний період, під час якого ми
                            оцінюємо його професійний підхід, дотримання етичних стандартів та здатність працювати з
                            людьми, які пережили бойовий досвід. Ми обираємо лише тих фахівців, які вміють уважно слухати, підтримувати та допомагати військовим і ветеранам відновлювати психологічну рівновагу.
                        </div>
                    </div>

                    <img className="stat-right-image" src={block3img} alt="Картинка справа"/>
                </div>
            </div>

            <div className="text-green text-5xl font-semibold stat-title text-center mb-8">
                Питання та відповіді
            </div>
            <div className="accordion-container">
                <Accordion variant="splitted">
                    <AccordionItem
                        key="1"
                        aria-label="Accordion 1"
                        title="Як сформулювати запит до психолога?"
                        css={{
                            border: 'none',
                            padding: 0,
                        }}
                        className="custom-accordion-item"
                    >
                        <div className="custom-accordion-content">
                            Самостійно ідентифікувати корінь проблеми може бути доволі складно.
                            Не треба переживати – психотерапевт доможе із визначенням запиту. У такому разі вам слід
                            описати симптоматику проблеми: що саме приносить дискомфорт, як це впливає на ваше
                            повсякдення,
                            як саме це пов'язано з навчальним процесом.
                        </div>
                    </AccordionItem>
                    <AccordionItem
                        key="2"
                        aria-label="Accordion 2"
                        title="У чому різниця між психологом, психотерапевтом і психіатром?"
                        className="custom-accordion-item"
                    >
                        <div className="custom-accordion-content">
                            <strong>Психолог </strong>
                            — фахівець, який здобув вищу психологічну освіту. Зазвичай робота з психологом
                            короткострокова: потрібні кілька зустрічей, щоб розібратися з конкретною проблемою чи
                            ситуацією.
                            <br/>
                            <br/>
                            <strong>Психотерапевт </strong>
                            — спеціаліст із медичною освітою або з вищою/додатковою психологічною освітою. Перші можуть
                            виписувати медикаментозне лікування та доповнювати його деякими видами психотерапії. Другі
                            працюють із тим, що ми зазвичай маємо на увазі під психотерапією. Цих терапевтів на нашій
                            платформі – більшість. Вони використовують такі довгострокові методи, як психоаналіз, і
                            короткострокові – як, наприклад, когнітивно-поведінкова терапія.
                            <br/>
                            <br/>
                            <strong>Психіатр </strong>
                            — спеціаліст, який має вищу медичну освіту. Психіатр займається діагностикою, профілактикою
                            та лікуванням психічних хвороб, спираючись на фізіологію. У більшості випадків йдеться про
                            медикаментозне лікування.
                        </div>
                    </AccordionItem>
                    <AccordionItem
                        key="3"
                        aria-label="Accordion 3"
                        title="Як вибрати психолога онлайн?"
                        className="custom-accordion-item"
                    >
                        <div className="custom-accordion-content">
                            На нашій платформі є два способи вибрати фахівця:
                            <br/>
                            <br/>
                            1. відповісти на кілька запитань й отримати добірку спеціалістів, які найкраще вам
                            підходять;
                            <br/>
                            2. вибрати самостійно серед усіх спеціалістів платформи.
                        </div>
                    </AccordionItem>
                    <AccordionItem
                        key="4"
                        aria-label="Accordion 4"
                        title="Як відбувається перша сесія?"
                        className="custom-accordion-item"
                    >
                        <div className="custom-accordion-content">
                            Здебільшого це зустріч-знайомство. Для роботи фахівцю потрібно більше дізнатися про вас.
                            Він може розпитувати, що привело на сеанс, а також про різні життєві події, сім'ю, стосунки
                            тощо. Або ж слухатиме вашу розповідь, спрямовуючи уточнювальними запитаннями.
                        </div>
                    </AccordionItem>
                    <AccordionItem
                        key="5"
                        aria-label="Accordion 5"
                        title="Скільки сесій мені знадобиться та який результат я отримаю?"
                        className="custom-accordion-item"
                    >
                        <div className="custom-accordion-content">
                            Кількість сесій залежить від ваших потреб та того, наскільки глибокі зміни ви хочете
                            отримати.
                            Психологу вистачить 1-2 сесії для загального аналізу стану та обговорення навчальних або
                            життєвих труднощів.
                            Для швидких змін, наприклад адаптації до студентського життя чи покращення концентрації,
                            достатньо 5-10 сеансів.
                            Для більш глибокої роботи з емоційними блоками, стресом або складними переживаннями може
                            знадобитися більше часу.
                            <br/>
                            <br/>
                            Результат консультацій залежить від ваших конкретних запитів.
                            Якщо вас турбує тривога перед іспитами, психолог допоможе навчитися керувати стресом та
                            панічними відчуттями.
                            Якщо важливо покращити адаптацію у новому середовищі або впоратися з емоційними труднощами,
                            консультації допоможуть знайти власні стратегії та впевнено рухатися вперед.
                        </div>

                    </AccordionItem>
                    <AccordionItem
                        key="6"
                        aria-label="Accordion 6"
                        title="Скільки коштує консультація психотерапевта?"
                        className="custom-accordion-item"
                    >
                        <div className="custom-accordion-content">
                            На нашій платформі представлені фахівці, вартість 50-хвилинної сесії яких коливається
                            приблизно від 600 грн і до 2600 грн. Ціну за сеанс кожен психолог виставляє самостійно,
                            вона залежить від кваліфікації та досвіду.
                        </div>
                    </AccordionItem>
                    <AccordionItem
                        key="7"
                        aria-label="Accordion 7"
                        title="Усе сказане мною на сесії - конфіденційно?"
                        className="custom-accordion-item"
                    >
                        <div className="custom-accordion-content">
                            Зв’язок між вами та фахівцем відбувається напряму, без будь-якої участі з нашого боку.
                            Все, що відбувається на сесії, – конфіденційно.
                        </div>
                    </AccordionItem>
                </Accordion>
            </div>

            <div className="text-green text-5xl font-semibold stat-title text-center mb-8">
                Коли необхідно звернутись по допомогу спеціаліста?
            </div>

            <div className="text-container">
                <span className="content-text">
                    <br/>
                    Війна та служба в умовах постійного стресу можуть залишати глибокий психологічний слід. Після
                    повернення з бойових завдань або навіть під час служби багато військових стикаються з емоційними та
                    психологічними труднощами. Це може бути наслідком пережитих небезпечних ситуацій, втрати побратимів,
                    тривалого напруження або складнощів адаптації до мирного життя. З часом людина може помічати зміни у
                    своєму стані: підвищену тривожність, втому, дратівливість або втрату інтересу до звичних речей.
                    У таких ситуаціях важливо не залишатися наодинці зі своїми переживаннями та звернутися по допомогу
                    до фахівця. Варто звернути увагу на такі ознаки:
                    <br/>
                    <br/>
                </span>
                <span className="list-text">
                    <ul>
                        <li>Важко контролювати емоції, з’являються спалахи агресії або сильна дратівливість.</li>
                        <li>Постійне відчуття тривоги, напруги або небезпеки.</li>
                        <li>Втрачається інтерес до звичних занять, спілкування або активностей.</li>
                        <li>Проблеми зі сном: безсоння, часті пробудження, нічні кошмари.</li>
                        <li>Постійна втома або відчуття емоційного виснаження.</li>
                        <li>Складно адаптуватися до мирного життя після служби.</li>
                        <li>Труднощі у спілкуванні з близькими або відчуття соціальної ізоляції.</li>
                        <li>Зміни у харчуванні або різкі коливання настрою.</li>
                        <li>Спроби зменшити напругу за допомогою алкоголю чи інших речовин.</li>
                        <li>Відчуття, що потрібні зміни, але незрозуміло, з чого почати.</li>
                    </ul>
                </span>
                <span className="final-text">
                    <br/>Особливо важливо звернутися до психолога або психотерапевта, якщо ви відчуваєте сильний стрес,
                    тривогу, депресивні настрої або труднощі, які впливають на повсякденне життя та взаємини з близькими.
                    Консультація може допомогти зрозуміти власний стан, навчитися керувати емоціями та поступово
                    відновлювати внутрішню рівновагу.
                    <br/>Не варто чекати, поки проблеми накопичаться — психологічна підтримка є важливою частиною
                    відновлення після пережитого досвіду.
                </span>
            </div>


            <div className="Group15">
                <div className="text-green text-5xl font-semibold stat-title text-center mb-8">
                    Екстрені служби
                </div>
                <div className="Group16">
                    <div className="Rectangle6">
                        <p className="text-description">
                            <strong>Цілодобова гаряча лінія психологічної підтримки для військових</strong><br/><br/>
                            Спеціалізована телефонна служба, де кваліфіковані психологи доступні 24/7 для консультацій
                            і підтримки у кризових ситуаціях. Фахівці допомагають впоратися зі стресом, тривогою,
                            емоційним напруженням, а також можуть направити до відповідних спеціалістів для тривалої
                            психологічної допомоги.

                        </p>
                        <div className="Rectangle5">
                            <div className="phone-numbers">(067) 594 94 46<br/>(095) 913 69 41</div>
                        </div>
                    </div>

                    <div className="Rectangle7">
                        <p className="text-description">
                            <strong>Мобільні групи кризової психологічної допомоги</strong><br/><br/>
                            Команди психологів, які за потреби можуть оперативно надати підтримку військовим, ветеранам
                            або їхнім родинам у складних психологічних ситуаціях. Вони допомагають стабілізувати
                            емоційний стан, надати кризову допомогу та визначити подальші кроки для відновлення
                            психологічного здоров’я.

                        </p>
                        <div className="Rectangle5">
                            <div className="phone-numbers">(067) 594 94 46<br/>(095) 913 69 41</div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
};

export default MainPage;
