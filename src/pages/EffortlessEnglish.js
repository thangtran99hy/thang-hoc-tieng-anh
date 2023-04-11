import React, { useEffect, useState } from 'react';
import { Tree, Tabs, Modal } from 'antd';
import _ from 'lodash';

const EffortlessEnglish = (props) => {
  const [dataBooks, seDataBooks] = useState(
    require('./../data/effortlessEnglish.json')
  );

  const [book, setBook] = useState(null);
  const [audio, setAudio] = useState(false);
  const treeBooks = dataBooks.items.map((item, index) => {
    return {
      title: item.name,
      key: `${index}`,
      audio: item.audio,
    };
  });

  const onSelect = (selectedKeys, info) => {
    setBook(info.node);
  };

  useEffect(() => {
    setAudio(null);
  }, [book]);
  return (
    <div className="flex h-full">
      <div className="px-2 overflow-y-auto w-full">
        <Tree
          showLine={true}
          showIcon={false}
          defaultExpandedKeys={[]}
          onSelect={onSelect}
          treeData={treeBooks}
        />
      </div>
      {book && (
        <Modal
          title={book.title}
          open={!!book}
          onCancel={() => {
            setBook(null);
          }}
          footer={null}
          className="w-[1500px] top-[16px]"
        >
          <div
            className="flex flex-col"
            style={{
              height: 'calc(100vh - 200px)',
            }}
          >
            <div className="flex pb-2">
              {Array.isArray(book.audio) && (
                <>
                  {book.audio.map((item, index) => {
                    return (
                      <div
                        className={`w-[36px] min-w-[36px] h-[36px] mx-1 cursor-pointer rounded-full border flex items-center justify-center ${
                          audio === item &&
                          'bg-gray-500 text-[white]'
                        }`}
                        onClick={() => {
                          if (audio) {
                            setAudio(null);
                            setTimeout(() => {
                              setAudio(item);
                            }, 500);
                          } else {
                            setAudio(item);
                          }
                        }}
                      >
                        {index + 1}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
            {audio && (
              <div className="pb-2">
                <audio controls autoPlay loop>
                  <source
                    src={`https://docs.google.com/uc?export=download&id=${audio}`}
                  />
                </audio>
              </div>
            )}
            <div className="flex-1 effortlessEnglishTab">
              <Tabs
                defaultValue={'transcriptAudio'}
                items={[
                  {
                    key: 'transcriptAudio',
                    label: 'Transcript Audio',
                    children: (
                      <iframe
                        src={`https://drive.google.com/file/d/${dataBooks.transcriptAudio}/preview`}
                        width={'100%'}
                        height={'100%'}
                      ></iframe>
                    ),
                  },
                  {
                    key: 'transcriptMS',
                    label: 'Transcript MS',
                    children: (
                      <iframe
                        src={`https://drive.google.com/file/d/${dataBooks.transcriptMS}/preview`}
                        width={'100%'}
                        height={'100%'}
                      ></iframe>
                    ),
                  },
                  {
                    key: 'lessonOrder',
                    label: 'Transcript Audio',
                    children: (
                      <img
                        src={`https://drive.google.com/uc?export=view&id=${dataBooks.lessonOrder}`}
                      />
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EffortlessEnglish;
