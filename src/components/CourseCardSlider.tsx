import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './coursecardslider.css';
import { Course } from '../Int/Course';


type CourseCardProps = {
    activeCourses: Course[];
};

export default function CourseCardSlider({ activeCourses }: CourseCardProps) {
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
                {activeCourses.map((course, index) => (
                    <div key={index} className='course-card'>
                        <div className="course-code">{course.code}</div>
                        <div className="course-name">{course.name}</div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
}
