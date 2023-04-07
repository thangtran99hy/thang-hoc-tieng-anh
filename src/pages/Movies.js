import React, { useState } from "react";
import { Tree } from "antd";
const Movies = (props) => {
    const [dataMovies, setDataMovies] = useState(
        require("./../data/movies.json")
    );
    const [movie, setMovie] = useState(null);
    const treeMovies = dataMovies.map((item_1, index_1) => {
        return {
            title: item_1.name,
            key: `${index_1}`,
            children: item_1.items.map((item_2, index_2) => {
                if (item_2.hasOwnProperty("items")) {
                    return {
                        title: item_2.name,
                        key: `${index_1}-${index_2}`,
                        children: item_2.items.map((item_3, index_3) => {
                            return {
                                title: item_3.name,
                                key: `${index_1}-${index_2}-${index_3}`,
                                gDriveId: item_3.gDriveId,
                            };
                        }),
                    };
                }
                return {
                    title: item_2.name,
                    key: `${index_1}-${index_2}`,
                    gDriveId: item_2.gDriveId,
                };
            }),
        };
    });
    const onSelect = (selectedKeys, info) => {
        console.log("info", info);
        if (info.node?.gDriveId)
            setMovie({
                title: info.node?.title,
                gDriveId: info.node?.gDriveId,
            });
    };
    return (
        <div className="flex h-full">
            <div className="px-2 overflow-y-auto">
                <Tree
                    showLine={true}
                    showIcon={false}
                    defaultExpandedKeys={["0-0-0"]}
                    onSelect={onSelect}
                    treeData={treeMovies}
                />
            </div>
            <div className="flex-1 p-2">
                {movie && (
                    <iframe
                        src={`https://drive.google.com/file/d/${movie.gDriveId}/preview`}
                        width={"100%"}
                        height={"100%"}
                        allow="autoplay"
                    ></iframe>
                )}
            </div>
        </div>
    );
};

export default Movies;
