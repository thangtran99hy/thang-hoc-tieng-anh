import React, { useEffect, useState } from "react";
import { Tree } from "antd";
const EffortlessEnglish = (props) => {
    const [dataBooks, seDataBooks] = useState(require('./../data/effortlessEnglish.json'));
    
    const [book, setBook] = useState(null);
    const [audio, setAudio] = useState(false);
    const treeBooks = dataBooks.items.map((item, index) => {
        return {
            title: item.name,
            key: `${index}`,
            audio: item.audio,
        }
    })

    const onSelect = (selectedKeys, info) => {
        console.log("info", info);
        setBook(info.node)
        // if (info.node?.gDriveId)
        //     setMovie({ 
        //         title: info.node?.title,
        //         gDriveId: info.node?.gDriveId,
        //     });
    };

    useEffect(() => {
        setAudio(null)
    },[book])
    return (
        <div className="flex h-full">
            <div className="px-2 overflow-y-auto">
                <Tree
                    showLine={true}
                    showIcon={false}
                    defaultExpandedKeys={["0-0-0"]}
                    onSelect={onSelect}
                    treeData={treeBooks}
                />
            </div>
            <div className="flex flex-col flex-1 p-2">
                
                {book && (
                   <>
                    <div className="flex">
                    {Array.isArray(book.audio) && <>
                    
                        {
                            book.audio.map((item, index) => {
                                return (
                                    <div className="w-[36px] min-w-[36px] h-[36px] cursor-pointer rounded-full border flex items-center justify-center" onClick={() => {
                                       
                                        if (audio) {
                                            setAudio(null)
                                            setTimeout(() => {
                                                setAudio(item)
                                            }, 500)
                                        } else {
                                            setAudio(item)
                                        }
                                    }}>{index+1}</div>
                                )
                            })
                        }
                    </>}
                </div>
                    <div className="flex-1">
                        <iframe
                        src={`https://drive.google.com/file/d/${book.pdf}/preview`}
                        width={"100%"}
                        height={"100%"}
                    ></iframe>
                        </div>
                   </>
                )}
            </div>
        </div>
    );
}   

export default EffortlessEnglish;
