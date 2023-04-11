import React, { useState } from 'react';
import { Tree } from 'antd';
import _ from 'lodash';
import { Modal } from 'antd';

const Movies = (props) => {
  const [dataMovies, setDataMovies] = useState(
    require('./../data/movies.json')
  );
  const [movie, setMovie] = useState(null);
  const [expandedKeys, setExpandedKeys] = useState([]);
  const treeMovies = dataMovies.map((item_1, index_1) => {
    return {
      title: item_1.name,
      key: `${index_1}`,
      children: item_1.items.map((item_2, index_2) => {
        if (item_2.hasOwnProperty('items')) {
          return {
            title: item_2.name,
            name: `${item_1.name} / ${item_2.name}`,
            key: `${index_1}-${index_2}`,
            children: item_2.items.map(
              (item_3, index_3) => {
                return {
                  title: item_3.name,
                  name: `${item_1.name} / ${item_2.name} / ${item_3.name}`,
                  key: `${index_1}-${index_2}-${index_3}`,
                  gDriveId: item_3.gDriveId,
                };
              }
            ),
          };
        }
        return {
          title: item_2.name,
          name: `${item_1.name} / ${item_2.name}`,
          key: `${index_1}-${index_2}`,
          gDriveId: item_2.gDriveId,
        };
      }),
    };
  });
  const onSelect = (selectedKeys, info) => {
    if (info.node?.gDriveId)
      setMovie({
        title: info.node?.title,
        name: info.node?.name,
        gDriveId: info.node?.gDriveId,
      });
  };
  return (
    <div className="flex h-full">
      <div className="px-2 overflow-y-auto w-full">
        <Tree
          showLine={true}
          showIcon={false}
          defaultExpandedKeys={[]}
          onSelect={onSelect}
          treeData={treeMovies}
        />
      </div>

      {movie && (
        <Modal
          title={movie.name}
          open={!!movie}
          onCancel={() => {
            setMovie(null);
          }}
          footer={null}
          className="w-[1500px] top-[16px]"
        >
          <div
            style={{
              height: 'calc(100vh - 200px)',
            }}
          >
            <iframe
              src={`https://drive.google.com/file/d/${movie.gDriveId}/preview`}
              width={'100%'}
              height={'100%'}
              allow="autoplay"
              allowfullscreen="allowfullscreen"
              frameborder={0}
            ></iframe>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Movies;
