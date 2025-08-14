import { useAuth } from '../contexts/AuthContext.jsx';

export default function TokenCheck({ children }){
    const { loginToken } = useAuth();
    return (
        <>
            {loginToken ? children : null}
        </>
    )
}