import './dashboard.css';
import Card from '../components/Card';
import CalendarCard from '../components/CalendarCard';
import CourseCardSlider from '../components/CourseCardSlider';
import { Course } from '../Int/Course';

export default function Dashboard() {
    const activeCourses: Course[] = [
        { code: 10000, name: 'Blockchain' },
        { code: 10001, name: 'AI Ethics' },
        { code: 10002, name: 'NLP' },
        { code: 10003, name: 'Computer Vision' },
        { code: 10004, name: 'Reinforcement Learning' },
    ];

    return (
        <div className='container'>
            <h2 className='title'>Masters of Artificial Intelligence</h2>
            {/* <h3 className='sub-title'>Overview</h3> */}
            <div className='card-container'>
                <Card title={'Course'} percentage={25}></Card>
                <Card title={'Current year'} percentage={50}></Card>
                <Card title={'Grade'} grade={'16.5/20'}></Card>
                <Card title={'Wallet'}></Card>
            </div>

            <div className='bottom-section'>
                <div className='courses-container'>

                    <h3 className='sub-title'>Active courses</h3>
                    <CourseCardSlider activeCourses={activeCourses}></CourseCardSlider>

                </div>
                <div className='calendar-section'>
                    <h3 className='calendar-title'>Calendar</h3>
                    <CalendarCard />
                </div>

            </div>
        </div>
    );
}
