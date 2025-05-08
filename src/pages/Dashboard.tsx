import './dashboard.css';
import Card from '../components/Card';
import CalendarCard from '../components/CalendarCard';
import CourseCardSlider from '../components/CourseCardSlider';
import { ICourse, ISubject } from '../Interfaces/ICourse';
import { issueCredential } from '../web3/diploma';
import { useState } from 'react';
import Spinner from '../components/Spinner';

type DashboardProps = {
    user: string;
    wallet: string;
};

export default function Dashboard({ user, wallet }: DashboardProps) {
    const [activeSubjects, setActiveSubjects] = useState<ISubject[]>([
        { code: 10000, name: 'Blockchain', completed: false },
        { code: 10001, name: 'AI Ethics', completed: false },
        { code: 10002, name: 'NLP', completed: true },
        { code: 10003, name: 'Computer Vision', completed: true },
        { code: 10004, name: 'Reinforcement Learning', completed: true },
    ]);
    const course: ICourse =
    {
        code: 80001,
        name: 'Masters of Artificial Intelligence',
        university: 'ISCTE',
        subjects: activeSubjects
    }
    const [cousePercentage, setCoursePercentage] = useState(60);
    const [yearPercentage, _] = useState(50);
    const [loading, setLoading] = useState(false);

    const studentAddress = wallet;
    const studentName = user;

    const markSubjectCompleted = (code: number) => {
        setActiveSubjects(prevSubjects =>
            prevSubjects.map(subject =>
                subject.code === code ? { ...subject, completed: true } : subject
            )
        );
        setCoursePercentage(() => {
            const completedSubjects = activeSubjects.filter(subject => subject.completed).length + 1;
            const totalSubjects = activeSubjects.length;
            return Math.round((completedSubjects / totalSubjects) * 100);
        });
    };

    const handleIssue = () => {
        setLoading(true);
        issueCredential(studentAddress, studentName, course.name, course.university, true).then(() => {
            setLoading(false);
        }).catch((err) => {
            setLoading(false);
            console.error('Error issuing credential:', err);
        });
    };

    return (
        <div className='container'>
            <h2 className='title'>{course.name}</h2>
            <div className='card-container'>
                <Card title={'Course'} onClaim={() => handleIssue()} cousePercentage={cousePercentage}></Card>
                {loading && <Spinner />}
                <Card title={'Current year'} yearPercentage={yearPercentage}></Card>
                <Card title={'Grade'} grade={'16.5/20'}></Card>
                <Card title={'Wallet'}></Card>
            </div>

            <div className='bottom-section'>
                <div className='courses-container'>
                    <h3 className='sub-title'>Active subjects</h3>
                    {course.subjects && <CourseCardSlider onMarkCompleted={markSubjectCompleted} activeSubjects={course.subjects}></CourseCardSlider>}
                </div>
                <div className='calendar-section'>
                    <h3 className='calendar-title'>Calendar</h3>
                    <CalendarCard />
                </div>

            </div>
        </div>
    );
}
