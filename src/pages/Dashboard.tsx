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
import { W3CCredential } from '@0xpolygonid/js-sdk';

type DashboardProps = {
    user: string;
    wallet: string;
};

const defaultSubjects: ISubject[] = [
    { code: 10000, name: 'Blockchain', grade: 18, completed: false },
    { code: 10001, name: 'AI Ethics', grade: 17, completed: true },
    { code: 10002, name: 'NLP', grade: 17, completed: true },
    { code: 10003, name: 'Computer Vision', grade: 16, completed: true },
    { code: 10004, name: 'Reinforcement Learning', grade: 16, completed: true },
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
    const [credential, setCredential] = useState<W3CCredential | undefined>();
    const [averageGrade, setAverageGrade] = useState<number | null>(null);
    // const [yearPercentage] = useState(50);
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
        const grades = activeSubjects
            .filter(subject => subject.completed)
            .map(subject => subject.grade);

        if (grades.length > 0) {
            const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
            setAverageGrade(parseFloat(average.toFixed(1)));
        } else {
            setAverageGrade(null);
        }
    }, [activeSubjects]);

    useEffect(() => {
        localStorage.setItem('course', JSON.stringify(course));
    }, [course]);

    useEffect(() => {
        if (credential) localStorage.setItem("studentCredential", JSON.stringify(credential));
    }, [credential]);

    const markSubjectCompleted = async (completeSubject: ISubject) => {
        setLoading(true);
        const rewarded = await rewardTokens(wallet, completeSubject.grade ? completeSubject.grade : 10);
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
        issueCredential(studentAddress, studentName, course.name, course.university)
            .then((value) => {
                setLoading(false);
                setCourse(prevCourse => ({ ...prevCourse, concluded: true }));
                setCredential(value);
            })
            .catch((err) => {
                setLoading(false);
                console.error('Error issuing credential:', err);
            });
    };

    const resetCourse = () => {
        setCourse(defaultCourse);
        localStorage.removeItem("31613162306363302d623437352d353934372d613939302d3965613837383836323262322b300000000000000000000000000000000000000000000000000000000000000000000000000000")
        localStorage.removeItem("31613162306363302d623437352d353934372d613939302d3965613837383836323262322b300000000000000000000000000000000000000000000000000000000000000000000000000000a5211125f6dc4dc854ad445b6444f70817fe26567c58d92c255c4ef8133acd04")
        localStorage.removeItem("62636633393464312d633130352d353263632d613461662d3339353333393831386363342b300000000000000000000000000000000000000000000000000000000000000000000000000000")
        localStorage.removeItem("62636633393464312d633130352d353263632d613461662d3339353333393831386363342b3000000000000000000000000000000000000000000000000000000000000000000000000000006091193ec58a6c020183c2d889a92c32410f31812595f228d67a2bf37e04a729")
        localStorage.removeItem("identity")
        localStorage.removeItem("keystore")
        localStorage.removeItem("merkle-tree-meta")
        localStorage.removeItem("credential")
        localStorage.removeItem("profile")
        localStorage.removeItem("studentCredential")
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
                        <Card title={'Grade'} subtext={averageGrade ? `${averageGrade}/20` : 'N/A'} />
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
            )}
        </div>
    );
}
