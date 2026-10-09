import axios from "axios";
import React, { useEffect, useState } from "react";
import { motion, pageVariants, staggerContainer, staggerItem } from "../../motion/Animated";

const CATEGORY_LABEL = {
    latest: "Latest News",
    business: "Company & Business News",
    technology: "Industry & Technology Updates",
};

export default function Latest({ category = "latest" }) {

    const [news, setNews] = useState([]);
    const [nextPage, setNextPage] = useState("");
    const [prevPages, setPrevPages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNews = (pageToken = "") => {
        setLoading(true);

        // "latest" keeps the original general feed; business/technology filter
        // newsdata.io's category param for the Company / Industry sidebar links.
        const categoryParam = category !== "latest" ? `&category=${category}` : "&excludecategory=education,science,technology,world";
        const pageParam = pageToken ? `&page=${pageToken}` : "";

        axios.get(
            `https://newsdata.io/api/1/latest?apikey=pub_6866f08a213547c5868978fda1781d20&country=in,de&language=en&removeduplicate=1${categoryParam}${pageParam}`
        ).then((data) => {

            setNews(data.data.results || []);
            setNextPage(data.data.nextPage);

        }).catch((err) => {
            console.log("Error fetching news: " + err);
        }).finally(() => setLoading(false));
    };

    useEffect(() => {
        setPrevPages([]);
        fetchNews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [category]);

    const next = () => {
        if (!nextPage) return;
        setPrevPages([...prevPages, nextPage]);
        fetchNews(nextPage);
    };

    const prev = () => {
        if (prevPages.length === 0) return;
        const history = [...prevPages];
        const prevToken = history.pop();
        setPrevPages(history);
        fetchNews(prevToken);
    };

    return (
        <motion.div className="main-content" variants={pageVariants} initial="hidden" animate="visible">
            <div className="container-fluid news-container">
                <h2 className="page-title mb-4">{CATEGORY_LABEL[category] || "News"}</h2>

                {loading && <p className="text-secondary">Loading news...</p>}

                {!loading && news.length === 0 && (
                    <p className="text-secondary">No articles found right now — try again shortly.</p>
                )}

                <motion.div className="row" variants={staggerContainer} initial="hidden" animate="visible">
                    {news.map((item, index) => (
                        <motion.div className="col-lg-4 col-md-6 mb-4" key={index} variants={staggerItem}>
                            <a href={item.link} target="_blank" rel="noreferrer" className="text-decoration-none">
                                <div className="news-card">
                                    <img
                                        src={item.image_url || "https://via.placeholder.com/400x200"}
                                        className="news-img"
                                        alt="news"
                                    />
                                    <div className="news-content">
                                        <h6 className="news-title">
                                            {item.title}
                                        </h6>
                                        <p className="news-desc">
                                            {item.description
                                                ? item.description.substring(0, 80) + "..."
                                                : "Click to read full article"}
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </motion.div>
                    ))}

                </motion.div>

                <div className="text-center mt-4">
                    <button
                        className="btn btn-secondary me-3"
                        onClick={prev}
                        disabled={prevPages.length === 0}
                    >
                        Previous
                    </button>
                    <button
                        className="btn btn-purple"
                        onClick={next}
                        disabled={!nextPage}
                    >
                        Next
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
