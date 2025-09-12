package com.innochatbot.admin.command;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FileCommand {

    String pathId;
    String path;
    String accessId;
}
