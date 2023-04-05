import React, { useEffect, useState } from "react";
import _ from 'lodash';
import { Modal } from 'antd';

const pageSize = 10;
const Music = (props) => {
    const [dataMusic, setDataMusic] = useState(require('./../data/music.json'))
    console.log('dataMusic',dataMusic);
    const [data, setData] = useState({
        items: [],
        page: 0,
        hasMore: true
    })
    const [play, setPlay] = useState(null)

    const {
        items,
        page,
        hasMore,
        searchText
    } = data;
    useEffect(() => {
        if (page) {
            const newItems = dataMusic.slice((page-1)*pageSize,page*pageSize)
            setData(prev => ({
                ...prev,
                items: _.uniqBy([
                    ...prev.items,
                    ...newItems
                ], (e) => e.id)
            }))
        } else {
            setData(prev => ({
                ...prev,
                page: 1
            }))
        }
    }, [page])
    console.log('items',items)
    return (
        <div>
            {
                items.map((item, index) => {
                    return (
                        <div onClick={() => {
                            setPlay(item)
                        }}>
                            {item.name}
                            <img style={{
                                width: 240,
                            }} src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`}/>
                        </div>
                    )
                })
            }
            <Modal title={play?.name ?? ""} open={!!play} onCancel={() => {
                setPlay(null)
            }}
            footer={null}
            >
                {play && <div>
                <iframe width="420" height="345" src={`http://www.youtube.com/embed/${play.id}?autoplay=1`} frameborder="0" allowfullscreen />
                </div>}
            </Modal>
        </div>
    )
}

export default Music;