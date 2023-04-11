import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import _ from 'lodash';
import { Modal, Input, Space, Col, Row } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import SkeletonLoading from '../components/SkeletonLoading';
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
const { Search } = Input;
const pageSize = 10;
const Music = (props) => {
  const [dataMusic, setDataMusic] = useState(
    _.shuffle(require('./../data/music.json'))
  );
  const [data, setData] = useState({
    items: [],
    page: null,
    hasMore: true,
    loading: false,
  });
  const [play, setPlay] = useState(null);

  const [searchInput, setSearchInput] = useState('');
  const { items, page, hasMore, searchText, loading } =
    data;

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
        const newItems = dataMusic
          .filter((item) => {
            if (
              searchText.toLowerCase().trim().length === 0
            ) {
              return true;
            }
            const index1 = item.name
              .toLowerCase()
              .search(
                ' ' + searchText.toLowerCase().trim()
              );
            const index2 = item.name
              .toLowerCase()
              .search(searchText.toLowerCase().trim());
            return index1 !== -1 || index2 === 0;
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
      </Space>
      <div className="overflow-y-auto flex flex-col items-center w-[100vw]">
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
                  <img
                    className="w-full h-[150px]"
                    src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`}
                  />
                  <div className="p-2">{item.name}</div>
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

      <Modal
        title={play?.name ?? ''}
        open={!!play}
        onCancel={() => {
          setPlay(null);
        }}
        footer={null}
        className="w-[1500px] top-[16px]"
      >
        {play && (
          <div
            style={{
              height: 'calc(100vh - 120px)',
            }}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${play.id}`}
              // src="https://www.youtube.com/embed/NmugSMBh_iI"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowfullscreen
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Music;
