"use client";

import React, { useState, useRef, useEffect } from 'react';

import PostCard from "./PostCard"


function ListPosts({ allPosts }) {
    const [posts, setPosts] = useState(allPosts);
   
    
    return (
        <div className="container mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {posts.map(post => (
                <PostCard key={post.id} post={post} />
            ))}
        </div>
    );

}

export default ListPosts