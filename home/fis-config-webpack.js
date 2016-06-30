var path = require('path');

var fis3_webpack = require('fis3_webpack');

function is_entry(file)
{
    return true;
    var dirs = file.subdirname.split("/");
    return dirs[dirs.length - 1] == file.filename
}

module.exports = function(fis) {
    
    fis.config.set('project.fileType.text', 'jsx'); //*.jsx files are text file.
    fis.config.set('roadmap.ext.jsx', 'js');        //*.jsx are exactly treat as *.js
    
    fis.match('**', {
        useSameNameRequire: false
    });
    
    fis.match('**/page/**.css', {
        release: false
    });

    fis.match('**/page/**/index.jsx', {
        optimizer: null,
        useHash: true,
        parser: function(content, file, conf) {
            
            //console.log(file); throw 1;
            
            if (!is_entry(file)) return content;
    
            var entry = [__dirname, file.subpath].join(path.sep);
            var out_dir = [__dirname, 'output/cache', file.subdirname].join(path.sep);
    
            var options = {
                //optimized: true,
                entry: entry,
                output: {
                    filename: file.filename + '.js',
                    path: out_dir
                },
                module: {
                    //加载器配置
                    loaders: [
                        { test: /\.jsx$/, loader: 'jsx-loader?harmony'},
                        { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192'},
                        { test: /\.css$/, loader: "style!css"}
                    ],
                    resolve: {
                      root: [
                        path.resolve('./components'),
                      ],
                      modulesDirectories: [
                        path.resolve('./components'),
                      ],
                      extensions: ["", ".webpack.js", ".web.js", ".js", ".jsx"]
                    }
                }
            };
            
            return fis3_webpack.compileSync(file, content, options);
        },
        rExt: 'js'
    })
    
}