const { useState, useEffect } = React;

// Mock JSON for user authentication
const users = {
  users: [
    {
      username: "demo",
      email: "demo@example.com",
      password: "demo123",
      dob: "1990-01-01"
    }
  ]
};

const calculateAge = (dob) => {
  const today = new Date();
  const birthDate = new Date(dob);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
};

const LoginForm = ({ onLogin, switchToSignup }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = users.users.find(u => 
      u.username === formData.username && u.password === formData.password
    );
    if (user) {
      onLogin(user);
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Welcome Back!</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Login
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={switchToSignup}
          className="text-blue-500 hover:text-blue-600"
        >
          Sign Up
        </button>
      </p>
    </div>
  );
};

const SignupForm = ({ onSignup, switchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    dob: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const age = calculateAge(formData.dob);
    if (age < 18) {
      alert('You must be 18 or older to register');
      return;
    }
    users.users.push(formData);
    onSignup(formData);
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <div className="mb-6">
          <input
            type="date"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            value={formData.dob}
            onChange={(e) => setFormData({...formData, dob: e.target.value})}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Sign Up
        </button>
      </form>
      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <button
          onClick={switchToLogin}
          className="text-blue-500 hover:text-blue-600"
        >
          Login
        </button>
      </p>
    </div>
  );
};

const Dashboard = ({ user, onLogout }) => {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('United States');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://active-jobs-db.p.rapidapi.com/active-ats-1h',
          params: {
            title_filter: search || 'Software Engineer',
            location_filter: location
          },
          headers: {
            'X-RapidAPI-Key': 'YOUR_RAPIDAPI_KEY', // Replace with your actual RapidAPI key
            'X-RapidAPI-Host': 'active-jobs-db.p.rapidapi.com'
          }
        };

        const response = await axios.request(options);
        setJobs(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
        // Show some mock data if API fails
        setJobs([
          {
            id: 1,
            title: 'Senior Software Engineer',
            company: 'TechCorp',
            location: 'New York, USA',
            description: 'Looking for an experienced software engineer...'
          },
          // Add more mock jobs here
        ]);
      }
    };

    // Add debounce to prevent too many API calls
    const timeoutId = setTimeout(() => {
      fetchJobs();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [search, location]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-600">KodJobs Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {user.username}!</span>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="Search job titles..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select
              className="px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="United States">United States</option>
              <option value="Remote">Remote</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-gray-600">
            No jobs found. Try adjusting your search criteria.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job, index) => (
              <div key={job.id || index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                <p className="text-gray-600 mb-2">{job.company}</p>
                <p className="text-gray-500 mb-2 flex items-center">
                  <span className="mr-2">📍</span> {job.location}
                </p>
                <p className="text-sm text-gray-500 mb-4 line-clamp-3">{job.description}</p>
                <div className="flex justify-between items-center">
                  <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
                    Apply Now
                  </button>
                  <span className="text-sm text-gray-500">
                    Posted: {new Date(job.posted_at || Date.now()).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

const App = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleSignup = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-white max-w-xl">
          <h1 className="text-5xl font-bold mb-6">Welcome to KodJobs</h1>
          <p className="text-xl mb-8">Where Talent Meets Opportunity</p>
          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <span className="text-4xl mb-4 block">🎯</span>
              <h3 className="text-xl font-semibold mb-2">Find Your Dream Job</h3>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <span className="text-4xl mb-4 block">🚀</span>
              <h3 className="text-xl font-semibold mb-2">Grow Your Career</h3>
            </div>
            <div className="bg-white bg-opacity-10 p-6 rounded-lg">
              <span className="text-4xl mb-4 block">🤝</span>
              <h3 className="text-xl font-semibold mb-2">Connect with Employers</h3>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center p-8 bg-white bg-opacity-10 backdrop-blur-lg">
        {isLogin ? (
          <LoginForm
            onLogin={handleLogin}
            switchToSignup={() => setIsLogin(false)}
          />
        ) : (
          <SignupForm
            onSignup={handleSignup}
            switchToLogin={() => setIsLogin(true)}
          />
        )}
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); 