import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import _ from 'lodash';
import { Modal, Input, Space, Col, Row, Tabs } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import SkeletonLoading from '../components/SkeletonLoading';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const { Search } = Input;
const pageSize = 10;
const Video = (props) => {
  const [dataVideos, setDataVideos] = useState(
    _.shuffle(require('./../data/videos.json'))
  );

  const [data, setData] = useState({
    items: [],
    page: null,
    hasMore: true,
    loading: false,
    levels: [1],
  });
  const [play, setPlay] = useState(null);
  const [tabActive, setTabActive] = useState('video');

  const [searchInput, setSearchInput] = useState('');
  const {
    items,
    page,
    hasMore,
    searchText,
    loading,
    levels,
  } = data;

  const observer = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            setData((prev) => ({
              ...prev,
              page: prev.page + 1,
            }));
          }
        }
      );
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );
  useEffect(() => {
    if (page === null) return;
    if (page) {
      setData((prev) => ({
        ...prev,
        loading: true,
      }));
      sleep(500).then(() => {
        const newItems = dataVideos
          .filter((item) => {
            if (
              searchText.toLowerCase().trim().length === 0
            ) {
              return (
                !levels.length ||
                levels.includes(item.level)
              );
            }
            const index1 = item.title
              .toLowerCase()
              .search(
                ' ' + searchText.toLowerCase().trim()
              );
            const index2 = item.title
              .toLowerCase()
              .search(searchText.toLowerCase().trim());
            return (
              (index1 !== -1 || index2 === 0) &&
              (!levels.length ||
                levels.includes(item.level))
            );
          })
          .slice((page - 1) * pageSize, page * pageSize);
        setData((prev) => ({
          ...prev,
          items: _.uniqBy(
            [
              ...(page === 1 ? [] : prev.items),
              ...newItems,
            ],
            (e) => e.id
          ),
          hasMore:
            newItems.length < pageSize ? false : true,
          loading: false,
        }));
      });
    } else {
      setData((prev) => ({
        ...prev,
        page: 1,
      }));
    }
  }, [page]);

  const debounceSearchText = useCallback(
    _.debounce((text) => {
      setData((prev) => ({
        ...prev,
        page: 0,
        hasMore: true,
        loading: false,
        searchText: text,
      }));
    }, 200),
    []
  );
  useEffect(() => {
    debounceSearchText(searchInput);
  }, [searchInput]);

  const showPlayTabView = () => {
    let transcripts = [];
    switch (tabActive) {
      case 'video':
        return (
          <video
            width="100%"
            controls
            autoPlay
            controlsList="nodownload"
            loop
          >
            <source src={play.video} type="video/mp4" />
            <track
              kind="captions"
              srclang="en"
              src={require(`./../data/transcripts/${play.id}.vtt`)}
              label="English"
              default="en"
            />
          </video>
        );
      case 'audio':
        transcripts = require(`./../data/jsonTranscripts/${play.id}`);
        return (
          <div>
            <audio controls autoPlay loop>
              <source src={play.audio} type="audio/mp3" />
            </audio>
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: 'calc(100vh - 360px)',
              }}
            >
              {transcripts.map((transcriptItem, index) => {
                return (
                  <div className="text-gray-500 text-sm mt-1">
                    {transcriptItem}
                  </div>
                );
              })}
            </div>
          </div>
        );
      case 'slowAudio':
        transcripts = require(`./../data/jsonTranscripts/${play.id}`);
        return (
          <div>
            <audio controls autoPlay loop>
              <source
                src={play.slowAudio}
                type="audio/mp3"
              />
            </audio>
            <div
              className="overflow-y-auto"
              style={{
                maxHeight: 'calc(100vh - 360px)',
              }}
            >
              {transcripts.map((transcriptItem, index) => {
                return (
                  <div className="text-gray-500 text-sm mt-1">
                    {transcriptItem}
                  </div>
                );
              })}
            </div>
          </div>
        );
      default:
        return <></>;
    }
  };

  useEffect(() => {
    setTabActive('video');
  }, [play]);
  console.log('tabActive', tabActive);
  const allLevels = [1, 2, 3, 4, 5, 6, 7];
  return (
    <div className="margin-auto flex flex-col items-center  h-full w-full">
      <Space className="margin-auto p-2 flex items-center flex-wrap">
        <Search
          placeholder="Enter keyword"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);
          }}
          suffix={
            <CloseOutlined
              onClick={() => {
                setSearchInput('');
              }}
              style={
                searchInput === ''
                  ? { display: 'none' }
                  : {}
              }
            />
          }
        />
        <div className="flex items-center">
          {allLevels.map((item, index) => {
            return (
              <div
                className={`w-[36px] min-w-[36px] h-[36px] mx-1 cursor-pointer rounded-full border flex items-center justify-center ${
                  levels.includes(item) &&
                  'bg-gray-500 text-[white]'
                }`}
                onClick={() => {
                  setData((prev) => ({
                    ...prev,
                    page: 0,
                    levels: !prev.levels.includes(item)
                      ? [...prev.levels, item]
                      : prev.levels.filter(
                          (itemL) => itemL !== item
                        ),
                    items: [],
                    hasMore: true,
                    loading: false,
                  }));
                }}
              >
                {item}
              </div>
            );
          })}
        </div>
      </Space>
      <div
        className="overflow-y-auto flex flex-col items-center w-[100vw]"
        style={{
          maxHeight: 'calc(100% - 60px)',
        }}
      >
        <Row className="max-w-5xl ">
          {items.map((item, index) => {
            return (
              <Col
                ref={(ref) => {
                  if (index === items.length - 1) {
                    lastItemRef(ref);
                  }
                }}
                xs={24}
                sm={12}
                md={8}
                lg={6}
                xl={6}
                className="p-4 min-w-[240px] max-w-[320px] max-sm:m-auto"
              >
                <div
                  className="flex flex-col cursor-pointer shadow-md rounded-lg overflow-hidden relative"
                  onClick={() => {
                    setPlay(item);
                  }}
                >
                  <div className="absolute bg-gray-600 w-[24px] min-w-[24px] h-[24px] flex items-center justify-center text-white font-bold rounded-br-lg">
                    {item.level}
                  </div>
                  <img
                    className="w-full h-[150px]"
                    src={item.thumbnail}
                  />
                  <div className="p-2">{item.title}</div>
                </div>
              </Col>
            );
          })}
          {loading && hasMore && (
            <>
              {[1, 2, 3, 4].map((item) => (
                <SkeletonLoading key={item} />
              ))}
            </>
          )}
        </Row>
      </div>

      {play && (
        <Modal
          title={play?.title ?? ''}
          open={!!play}
          onCancel={() => {
            setPlay(null);
          }}
          footer={null}
          className="w-[1200px] top-[16px]"
        >
          {play ? (
            <div>
              <Tabs
                defaultValue={'video'}
                onChange={(value) => {
                  setTabActive(null);
                  setTimeout(() => {
                    setTabActive(value);
                  }, 200);
                }}
                items={[
                  {
                    label: 'Video',
                    key: 'video',
                    children: <></>,
                  },
                  {
                    label: 'Audio',
                    key: 'audio',
                    children: <></>,
                  },
                  {
                    label: 'Slow audio',
                    key: 'slowAudio',
                    children: <></>,
                  },
                ]}
              />
              <div>{showPlayTabView()}</div>
            </div>
          ) : (
            <></>
          )}
        </Modal>
      )}
    </div>
  );
};

export default Video;
