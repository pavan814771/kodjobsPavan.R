const App = () => {
  return (
    <div style={{padding: '20px'}}>
      <h1>Test Page</h1>
      <p>If you can see this, React is working!</p>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
