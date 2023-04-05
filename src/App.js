import logo from './logo.svg';
import './App.css';
import Music from './pages/Music';
import { BookFilled , VideoCameraFilled, PlayCircleFilled, CustomerServiceFilled, CheckCircleFilled  } from '@ant-design/icons';
import { Tabs } from 'antd';
import Video from './pages/Video';
import Movies from './pages/Movies';
import Book from './pages/Book';
import EffortlessEnglish from './pages/EffortlessEnglish';
function App() {
  const tabs = [
  
    {
      code: 'music',
      label: 'Music',
      component: Music,
      icon: CustomerServiceFilled
    },
    {
      code: 'video',
      label: 'Video',
      component: Video,
      icon: PlayCircleFilled
    },
    {
      code: 'movies',
      label: 'Movies',
      component: Movies,
      icon: VideoCameraFilled
    },
    {
      code: 'book',
      label: 'Book',
      component: Book,
      icon: BookFilled 
    },
    {
      code: 'effortlessEnglish',
      label: 'Effortless English',
      component: EffortlessEnglish,
      icon: CheckCircleFilled 
    },
  ]
  return (
    <Tabs
    defaultActiveKey="2"
    items={tabs.map((tab, i) => {
      const id = String(i + 1);

      return {
        label: (
          <div style={{
            padding: 10,
          }}>
            <tab.icon />
            <div>{tab.label}</div>
          </div>
        ),
        key: id,
        children: <tab.component />,
      };
    })}
  />
  );
}

export default App;
