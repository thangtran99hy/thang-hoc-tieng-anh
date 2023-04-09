import './App.css';
import Music from './pages/Music';
import {
  BookFilled,
  VideoCameraFilled,
  PlayCircleFilled,
  CustomerServiceFilled,
  CheckCircleFilled,
} from '@ant-design/icons';
import { Tabs } from 'antd';
import Video from './pages/Video';
import Movies from './pages/Movies';
import Book from './pages/Book';
import EffortlessEnglish from './pages/EffortlessEnglish';
import { useState } from 'react';
function App() {
  const [tabActive, setTabActive] = useState('music');
  const tabs = [
    {
      code: 'music',
      label: 'Music',
      component: Music,
      icon: CustomerServiceFilled,
    },
    {
      code: 'video',
      label: 'Video',
      component: Video,
      icon: PlayCircleFilled,
    },
    {
      code: 'movies',
      label: 'Movies',
      component: Movies,
      icon: VideoCameraFilled,
    },
    {
      code: 'book',
      label: 'Book',
      component: Book,
      icon: BookFilled,
    },
    {
      code: 'effortlessEnglish',
      label: 'Effortless English',
      component: EffortlessEnglish,
      icon: CheckCircleFilled,
    },
  ];

  const showTabView = () => {
    switch (tabActive) {
      case 'music':
        return <Music />;
      case 'video':
        return <Video />;
      case 'movies':
        return <Movies />;
      case 'book':
        return <Book />;
      case 'effortlessEnglish':
        return <EffortlessEnglish />;
      default:
        return <></>;
    }
  };
  return (
    <div className="flex flex-col h-[100vh]">
      <div className="flex flex-col items-center h-[72px] pt-1">
        <div className="text-gray-600 text-sm font-semibold">
          Thắng Nói Tiếng Anh
        </div>
        <img
          className="w-[36px] h-[36px] rounded-full"
          src={require('./assets/images/avatar.jpg')}
        />
      </div>
      <Tabs
        defaultValue={'music'}
        className="App_container"
        items={tabs.map((tab, i) => {
          return {
            label: (
              <div className="flex items-center px-2">
                <tab.icon />
                <div>{tab.label}</div>
              </div>
            ),
            key: tab.code,
            children: <></>,
          };
        })}
        onChange={(key) => {
          setTabActive(key);
        }}
      />
      <div
        className="flex-1"
        style={{
          height: 'calc(100vh - 150px)',
        }}
      >
        {showTabView()}
      </div>
    </div>
  );
}

export default App;
