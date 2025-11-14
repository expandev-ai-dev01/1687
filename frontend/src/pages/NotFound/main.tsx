import { useNavigate } from 'react-router-dom';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-16">
      <h1 className="mb-4 text-6xl font-bold text-gray-900">404</h1>
      <h2 className="mb-2 text-2xl font-semibold text-gray-700">Page Not Found</h2>
      <p className="mb-8 text-gray-600">The page you are looking for does not exist.</p>
      <button
        onClick={() => navigate('/')}
        className="rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFoundPage;
