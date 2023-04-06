import React, { useCallback, useEffect, useRef, useState } from "react";
import _ from "lodash";
import { Modal, Input, Space, Col, Row } from "antd";
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
const { Search } = Input;
const pageSize = 10;
const Music = (props) => {
    const [dataMusic, setDataMusic] = useState(
        _.shuffle(require("./../data/music.json"))
    );
    const [data, setData] = useState({
        items: [],
        page: null,
        hasMore: true,
        loading: false,
    });
    const [play, setPlay] = useState(null);

    const [searchInput, setSearchInput] = useState("");
    const { items, page, hasMore, searchText, loading } = data;

    const observer = useRef();
    const lastItemRef = useCallback(
        (node) => {
            if (loading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore) {
                    setData((prev) => ({
                        ...prev,
                        page: prev.page + 1,
                    }));
                }
            });
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
                        if (searchText.toLowerCase().trim().length === 0) {
                            return true;
                        }
                        const index1 = item.name
                            .toLowerCase()
                            .search(" " + searchText.toLowerCase().trim());
                        const index2 = item.name
                            .toLowerCase()
                            .search(searchText.toLowerCase().trim());
                        return index1 !== -1 || index2 === 0;
                    })
                    .slice((page - 1) * pageSize, page * pageSize);
                setData((prev) => ({
                    ...prev,
                    items: _.uniqBy(
                        [...(page === 1 ? [] : prev.items), ...newItems],
                        (e) => e.id
                    ),
                    hasMore: newItems.length < pageSize ? false : true,
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
        <div className="margin-auto flex flex-col items-center max-w-5xl h-full">
            <Space className="margin-auto p-2">
                <Search
                    placeholder="Enter keyword"
                    value={searchInput}
                    onChange={(e) => {
                        setSearchInput(e.target.value);
                    }}
                />
            </Space>
            <Row
                className="overflow-y-auto"
                style={{
                    maxHeight: "calc(100% - 60px)",
                }}
            >
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
                            className="p-4 min-w-[240px]"
                        >
                            <div
                                className="flex flex-col cursor-pointer shadow-md rounded-lg overflow-hidden"
                                onClick={() => {
                                    setPlay(item);
                                }}
                            >
                                <img
                                    className="w-full"
                                    src={`https://i.ytimg.com/vi/${item.id}/hqdefault.jpg`}
                                />
                                <div className="p-2">{item.name}</div>
                            </div>
                        </Col>
                    );
                })}
                {loading && hasMore && (
                    <>
                        {[1, 2, 3].map((item) => (
                            <Col
                                key={item}
                                xs={24}
                                sm={12}
                                md={8}
                                lg={6}
                                xl={6}
                                className="p-4 min-w-[240px]"
                            >
                                <div className="flex flex-col cursor-pointer shadow-md rounded-lg overflow-hidden">
                                    <div class="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded">
                                        <svg
                                            class="w-12 h-12 text-gray-200"
                                            xmlns="http://www.w3.org/2000/svg"
                                            aria-hidden="true"
                                            fill="currentColor"
                                            viewBox="0 0 640 512"
                                        >
                                            <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                                        </svg>
                                    </div>
                                    <div class="h-2.5 bg-gray-200 rounded-full w-48 mb-4"></div>
                                </div>
                            </Col>
                        ))}
                    </>
                )}
            </Row>

            <Modal
                title={play?.name ?? ""}
                open={!!play}
                onCancel={() => {
                    setPlay(null);
                }}
                footer={null}
            >
                {play && (
                    <div>
                        <iframe
                            width="420"
                            height="345"
                            src={`http://www.youtube.com/embed/${play.id}?autoplay=1`}
                            frameborder="0"
                            allowfullscreen
                        />
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Music;
