import { ClipLoader } from "react-spinners";

export default function Button ( {
    type = 'button',
    children,
    onClick,
    className = '',
    disabled = false,
    isLoading = false,
}: {
    type?: 'button' | 'submit' | 'reset';
    children: React.ReactNode;
    onClick?: ( e: React.MouseEvent<HTMLButtonElement> ) => void;
    className?: string;
    disabled?: boolean;
    isLoading?: boolean;
} ) {

    if ( isLoading ) {
        return (
            <button
                type={type}
                className={`retro-button ${ className } opacity-50 cursor-not-allowed`}
                disabled={true}
            >
                <ClipLoader 
                    size={16}
                    color="#ffffff" 
                    loading={isLoading} 
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />
            </button>
        );
    }

    return (
        <button
            type={type}
            className={`retro-button ${ className } ${ disabled ? 'opacity-50 cursor-not-allowed' : '' }`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
