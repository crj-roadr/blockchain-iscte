import { FaBook, FaCalendarAlt, FaGraduationCap, FaWallet } from 'react-icons/fa';
import './card.css';

type CardProps = {
    title: string;
    cousePercentage?: number;
    onClaim?: () => void;
    yearPercentage?: number;
    grade?: string;
};

export default function Card({ title, cousePercentage, onClaim, yearPercentage, grade }: CardProps) {
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

                {yearPercentage && (
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{ width: `${yearPercentage}%` }}
                        ></div>
                    </div>
                )}

                {cousePercentage !== undefined && title === "Course" && cousePercentage < 100 && (
                    <div className="progress-bar">
                        <div
                            className="progress"
                            style={{ width: `${cousePercentage}%` }}
                        ></div>
                    </div>
                )}

                {cousePercentage === 100 && onClaim && title === "Course" && (
                    <button onClick={() => onClaim()} className="claim-button">
                        Claim
                    </button>
                )}
            </div>
        </div>
    );
}
