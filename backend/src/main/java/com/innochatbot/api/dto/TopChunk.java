package com.innochatbot.api.dto;

public record TopChunk (Long chunkId, String fileId, String content, double score) {}
