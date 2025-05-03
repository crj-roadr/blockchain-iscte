import './dashboard.css';
import Card from '../components/Card';
import CalendarCard from '../components/CalendarCard';
import CourseCardSlider from '../components/CourseCardSlider';
import { Course } from '../Int/Course';
import { getCredential, issueCredential } from '../web3/diploma';

type DashboardProps = {
    user: string;
    wallet: string;
};

export default function Dashboard({ user, wallet }: DashboardProps) {
    const activeCourses: Course[] = [
        { code: 10000, name: 'Blockchain' },
        { code: 10001, name: 'AI Ethics' },
        { code: 10002, name: 'NLP' },
        { code: 10003, name: 'Computer Vision' },
        { code: 10004, name: 'Reinforcement Learning' },
    ];

    const studentAddress = wallet;
    const studentName = user;
    const degree = 'Masters of Artificial Intelligence';
    const university = 'Masters';

    const handleIssue = () => {
        issueCredential(studentAddress, studentName, degree, university);
    };

    const handleShow = () => {
        const credential = getCredential(studentAddress);
        credential.then((res) => {
            console.log('Credential:', res);
            alert(`Credential: ${res}`);

        });
    }

    return (
        <div className='container'>
            <h2 className='title'>Masters of Artificial Intelligence</h2>
            <button onClick={_ => handleIssue()}>Issue</button>
            <button onClick={_ => handleShow()}>Log</button>
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
