import './dashboard.css';
import Card from '../components/Card';
import CalendarCard from '../components/CalendarCard';
import CourseCardSlider from '../components/CourseCardSlider';
import { ICourse, ISubject } from '../Interfaces/ICourse';
import { issueCredential } from '../web3/diploma';
import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';

type DashboardProps = {
    user: string;
    wallet: string;
};

const defaultSubjects: ISubject[] = [
    { code: 10000, name: 'Blockchain', completed: false },
    { code: 10001, name: 'AI Ethics', completed: true },
    { code: 10002, name: 'NLP', completed: true },
    { code: 10003, name: 'Computer Vision', completed: true },
    { code: 10004, name: 'Reinforcement Learning', completed: true },
];

const defaultCourse: ICourse = {
    code: 80001,
    name: 'Masters of Artificial Intelligence',
    university: 'ISCTE',
    concluded: false,
    subjects: defaultSubjects,
};

export default function Dashboard({ user, wallet }: DashboardProps) {
    const [course, setCourse] = useState<ICourse>(() => {
        const saved = localStorage.getItem('course');
        return saved ? JSON.parse(saved) : defaultCourse;
    });

    const [activeSubjects, setActiveSubjects] = useState<ISubject[]>(() => {
        return defaultSubjects;
    });

    const [coursePercentage, setCoursePercentage] = useState<number>(80);

    const [yearPercentage] = useState(50);
    const [loading, setLoading] = useState(false);

    const studentAddress = wallet;
    const studentName = user;

    useEffect(() => {
        localStorage.setItem('course', JSON.stringify(course));
    }, [course]);

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
        issueCredential(studentAddress, studentName, course.name, course.university)
            .then(() => {
                setLoading(false);
                setCourse(prevCourse => ({ ...prevCourse, concluded: true }));
            })
            .catch((err) => {
                setLoading(false);
                console.error('Error issuing credential:', err);
            });
    };

    return (
        <div className='container'>
            {course && !course.concluded ? (
                <>
                    <h2 className='title'>{course.name}</h2>
                    <div className='card-container'>
                        <Card title={'Course'} onClaim={handleIssue} cousePercentage={coursePercentage} />
                        {loading && <Spinner />}
                        <Card title={'Current year'} yearPercentage={yearPercentage} />
                        <Card title={'Grade'} subtext={'16.5/20'} />
                        <Card title={'Wallet'} subtext={'15 tokens'} />
                    </div>

                    <div className='bottom-section'>
                        <div className='courses-container'>
                            <h3 className='sub-title'>Active subjects</h3>
                            {course.subjects && (
                                <CourseCardSlider
                                    onMarkCompleted={markSubjectCompleted}
                                    activeSubjects={activeSubjects}
                                />
                            )}
                        </div>
                        <div className='calendar-section'>
                            <h3 className='calendar-title'>Calendar</h3>
                            <CalendarCard />
                        </div>
                    </div>
                </>
            ) : (
                <div className="no-course">
                    <div className="course-completed-message">
                        <h2 className='title'>Parabéns!</h2>
                        <p className='conclusion-subtitle'>Concluiste o teu curso <strong>{course?.name}</strong></p>
                    </div>
                </div>
            )
            }
        </div>
    );
}
