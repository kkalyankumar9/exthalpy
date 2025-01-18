import logo from './logo.svg';
import './App.css';
import ReadFile from './Components/fileUploader';
import SummarisingCom from './Components/summarisingCom';

function App() {
  return (
    <div className="App">
     <ReadFile/>
     <SummarisingCom/>
    </div>
  );
}

export default App;
