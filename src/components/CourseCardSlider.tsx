import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './coursecardslider.css';
import { ISubject } from '../Interfaces/ICourse';
import Button from './Button';


type CourseCardProps = {
    activeSubjects: ISubject[];
    onMarkCompleted: (completedSubject: ISubject) => void;
};

export default function CourseCardSlider({ activeSubjects, onMarkCompleted }: CourseCardProps) {
    const responsive = {
        superLargeDesktop: {
            breakpoint: { max: 4000, min: 3000 },
            items: 5
        },
        desktop: {
            breakpoint: { max: 3000, min: 1400 },
            items: 3
        },
        tablet: {
            breakpoint: { max: 1400, min: 800 },
            items: 2
        },
        mobile: {
            breakpoint: { max: 800, min: 0 },
            items: 1
        }
    };

    return (
        <div className='course-slider-wrapper'>
            <Carousel responsive={responsive}>
                {activeSubjects.map((subject, index) => (
                    <div key={index} className={`course-card ${subject.completed ? 'completed' : ''}`}>
                        <div className="course-code">{subject.code}</div>
                        <div className="course-name">{subject.name}</div>
                        <div className="card-spacer"></div>
                        <div className="course-grade">Grade: {subject.grade}</div>
                        {subject.completed ? (
                            <div className="completed-label">
                                <span className="check-icon">✔</span> Completed
                            </div>
                        ) : (
                            <Button text='Complete' onClick={() => onMarkCompleted(subject)}></Button>
                        )}
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
