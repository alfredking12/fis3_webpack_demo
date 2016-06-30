
var fs = require('fs');
var path = require('path');
var webpack_sync = require('webpack_sync');

function is_entry(file)
{
    return true;
    var dirs = file.subdirname.split("/");
    return dirs[dirs.length - 1] == file.filename
}

module.exports = function(fis) {
    
    fis.config.set('project.ignore', fis.config.get('project.ignore').concat(['node_modules/**', '**/package.json', '**/webpack.config.js.tmp']));
    
    fis.config.set('project.fileType.text', 'jsx'); //*.jsx files are text file.
    fis.config.set('roadmap.ext.jsx', 'js');        //*.jsx are exactly treat as *.js
    
    fis.match('**', {
        useSameNameRequire: false
    });
    
    fis.match('**/page/**.css', {
        release: false
    });
    
    fis.match('**/page/**/index.jsx', {
            useHash: true,
        parser: function(content, file, conf) {
            //console.log(file); throw 1;
            
            if (!is_entry(file)) return content;
    
            var entry = [__dirname, file.subpath].join(path.sep);
            var out_dir = [__dirname, 'output/cache'+file.subdirname].join(path.sep);
    
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
                        { test: '{{jsx-loader-test}}', loader: 'jsx-loader?harmony', value: '/\\.jsx$/' },
                        { test: '{{url-loader-test}}', loader: 'url-loader?limit=8192', value: '/\\.(png|jpg)$/'},
                        { test: '{{css-loader-test}}', loader: "style!css", value: '/\\.css$/'}
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
            
            if (!webpack_sync(options))
            {
                fis.log.error("webpack失败");
            }
            else
            {
                content = fs.readFileSync(out_dir + path.sep + file.filename + '.js');
            }
    
            return content;
        },
        rExt: 'js'
    })

}