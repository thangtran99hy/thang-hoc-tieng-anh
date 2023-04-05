import React, { useState } from "react";
import { CarryOutOutlined, CheckOutlined, FormOutlined } from '@ant-design/icons';
import { Select, Switch, Tree } from 'antd';
const Movies = (props) => {
    const [dataMovies, setDataMovies] = useState(require('./../data/movies.json'))
    console.log('dataMovies',dataMovies);
    const [movie, setMovie] = useState(null);
    const treeMovies = dataMovies.map((item_1, index_1) => {
        return ({
            title: item_1.name,
            key: `${index_1}`,
            children: item_1.items.map((item_2, index_2) => {
                if (item_2.hasOwnProperty('items')) {   
                    return ({
                        title: item_2.name,
                        key: `${index_1}-${index_2}`,
                        children: item_2.items.map((item_3, index_3) => {
                            return ({
                                title: item_3.name,
                                key: `${index_1}-${index_2}-${index_3}`,
                                gDriveId: item_3.gDriveId
                            })
                        })
                    })
                }
                return ({
                    title: item_2.name,
                    key: `${index_1}-${index_2}`,
                    gDriveId: item_2.gDriveId
                })
            })
        })
    })
    const treeData = [
        {
          title: 'parent 1',
          key: '0-0',
          icon: <CarryOutOutlined />,
          children: [
            {
              title: 'parent 1-0',
              key: '0-0-0',
              icon: <CarryOutOutlined />,
              children: [
                {
                  title: 'leaf',
                  key: '0-0-0-0',
                  icon: <CarryOutOutlined />,
                },
                {
                  title: (
                    <>
                      <div>multiple line title</div>
                      <div>multiple line title</div>
                    </>
                  ),
                  key: '0-0-0-1',
                  icon: <CarryOutOutlined />,
                },
                {
                  title: 'leaf',
                  key: '0-0-0-2',
                  icon: <CarryOutOutlined />,
                },
              ],
            },
            {
              title: 'parent 1-1',
              key: '0-0-1',
              icon: <CarryOutOutlined />,
              children: [
                {
                  title: 'leaf',
                  key: '0-0-1-0',
                  icon: <CarryOutOutlined />,
                },
              ],
            },
            {
              title: 'parent 1-2',
              key: '0-0-2',
              icon: <CarryOutOutlined />,
              children: [
                {
                  title: 'leaf',
                  key: '0-0-2-0',
                  icon: <CarryOutOutlined />,
                },
                {
                  title: 'leaf',
                  key: '0-0-2-1',
                  icon: <CarryOutOutlined />,
                  switcherIcon: <FormOutlined />,
                },
              ],
            },
          ],
        },
        {
          title: 'parent 2',
          key: '0-1',
          icon: <CarryOutOutlined />,
          children: [
            {
              title: 'parent 2-0',
              key: '0-1-0',
              icon: <CarryOutOutlined />,
              children: [
                {
                  title: 'leaf',
                  key: '0-1-0-0',
                  icon: <CarryOutOutlined />,
                },
                {
                  title: 'leaf',
                  key: '0-1-0-1',
                  icon: <CarryOutOutlined />,
                },
              ],
            },
          ],
        },
      ];
    const onSelect = (selectedKeys, info) => {
        setMovie({
            title: info.node?.title,
            gDriveId: info.node?.gDriveId,
        })
    };
    console.log('movie',movie)
    return (
        <div>
            <div>
            <Tree
                showLine={true}
                showIcon={false}
                defaultExpandedKeys={['0-0-0']}
                onSelect={onSelect}
                treeData={treeMovies}
            />
            </div>
            <div>
                {
                    movie &&  <iframe src={`https://drive.google.com/file/d/${movie.gDriveId}/preview`}  width={640} height={480} allow="autoplay"></iframe>
                }
            </div>
        </div>
    )
}   

export default Movies;