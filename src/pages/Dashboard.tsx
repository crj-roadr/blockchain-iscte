import './dashboard.css';
import Card from '../components/Card';
import CalendarCard from '../components/CalendarCard';
import CourseCardSlider from '../components/CourseCardSlider';
import { ICourse, ISubject } from '../Interfaces/ICourse';
import { issueCredential } from '../web3/diploma';
import { useState, useEffect } from 'react';
import Spinner from '../components/Spinner';
import { rewardTokens, getTokenBalance, getSymbol } from '../web3/course-token';
import Button from '../components/Button';


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
    const [tokenBalance, setTokenBalance] = useState<string>('0');
    const [symbol, setSymbol] = useState<string>('');
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
        const init = async () => {
            const symbol = await getSymbol();
            if (wallet) {
                const tokenBalance = await getTokenBalance(wallet);
                setTokenBalance(tokenBalance);
            }
            setSymbol(symbol);
        };
        init();
    }, []);

    useEffect(() => {
        localStorage.setItem('course', JSON.stringify(course));
        // if (wallet) {
        //     fetchBalance();
        // }
    }, [course]);

    const markSubjectCompleted = async (completeSubject: ISubject) => {
        setLoading(true);
        const rewarded = await rewardTokens(wallet, 10);
        const updatedBalance = await getTokenBalance(wallet);
        setTokenBalance(updatedBalance);

        if (rewarded) {
            setActiveSubjects(prevSubjects =>
                prevSubjects.map(subject =>
                    subject.code === completeSubject.code ? { ...subject, completed: true } : subject
                )
            );

            setCoursePercentage(() => {
                const completedSubjects = activeSubjects.filter(subject => subject.completed).length + 1;
                const totalSubjects = activeSubjects.length;
                return Math.round((completedSubjects / totalSubjects) * 100);
            });
        }
        setLoading(false);
    };

    const handleIssue = () => {
        setLoading(true);
        // issueCredential(studentAddress, studentName, course.name, course.university)
        issueCredential()
            .then(() => {
                setLoading(false);
                setCourse(prevCourse => ({ ...prevCourse, concluded: true }));
            })
            .catch((err) => {
                setLoading(false);
                console.error('Error issuing credential:', err);
            });
    };

    const resetCourse = () => {
        setCourse(defaultCourse);
    };

    // const fetchBalance = async () => {
    //     const balance = await getTokenBalance(wallet);
    //     setTokenBalance(balance);
    // };

    return (
        <div className='container'>
            {course && !course.concluded ? (
                <>
                    <h2 className='title'>{course.name}</h2>
                    <div className='card-container'>
                        <Card title={'Course'} onClaim={handleIssue} cousePercentage={coursePercentage} />
                        {loading && <Spinner />}
                        <Card title={'Current year'} yearPercentage={coursePercentage} />
                        <Card title={'Grade'} subtext={'16.5/20'} />
                        <Card title={'Wallet'} subtext={`${parseFloat(tokenBalance)} ${symbol}`} />
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
                        <h2 className='title'>Congratulations!</h2>
                        <p className='conclusion-subtitle'>You have completed your course <strong>{course?.name}</strong></p>
                        <Button text='reset' onClick={resetCourse}></Button>
                    </div>
                </div>
            )
            }
        </div>
    );
}
