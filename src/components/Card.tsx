import { FaBook, FaCalendarAlt, FaGraduationCap, FaWallet } from 'react-icons/fa';
import './card.css';

type CardProps = {
    title: string;
    percentage?: number;
    grade?: string;
};

export default function Card({ title, percentage, grade }: CardProps) {
    const getIcon = () => {
        switch (title) {
            case 'Course':
                return <FaBook size={32} color="#4caf50" />;
            case 'Current year':
                return <FaCalendarAlt size={32} color="#2196f3" />;
            case 'Grade':
                return <FaGraduationCap size={32} color="#ff9800" />;
            case 'Wallet':
                return <FaWallet size={32} color="#9c27b0" />;
            default:
                return null;
        }
    };

    return (
        <div className="card">
            <div className="icon-container">
                {getIcon()}
            </div>

            <div className="content">
                <h2>{title}</h2>

                {title === 'Grade' && grade && (
                    <p className="grade">{grade}</p>
                )}

                {percentage !== undefined && (
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                )}
            </div>
        </div>
    );
}
