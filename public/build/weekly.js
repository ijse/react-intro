var converter = new Showdown.converter();

/*
 * Step 1: break the UI into a component hierarchy
 * - WeeklyReportComposer
 *   - RequirementsList
 *     - Requirement
 */

var WeeklyReportComposer = React.createClass({displayName: "WeeklyReportComposer",
    getInitialState: function () {
        return {
            quant: this.props.defaultNum, // 需求的数量
            userName: '陈敏'
        };
    },
    addToQuant: function (delta) {
        var newQuant = this.state.quant + delta;
        this.setState({
            quant: newQuant <= 0 ? 1 : newQuant
        });
    },
    handleChange: function () {
        var userName = React.findDOMNode(this.refs.userName).value;
        this.setState(function (previousState, currentProps) {
            return {
                quant: previousState.quant,
                userName: userName
            };
        });
    },
    mailTo: function () {
        var date = new Date();
        var to = encodeURIComponent('hb.rd.fe@meituan.com');
        var cc = encodeURIComponent('hb@meituan.com,mobile@meituan.com');
        var subject = encodeURIComponent('酒店事业部-前端研发组-'+this.state.userName+'-周报-'+date.toISOString().slice(0,10).replace(/-/g,""));

        return "mailto:"+to+"?"+"subject="+subject+"&cc="+cc;
    },
    render: function() {
      return (
          React.createElement("div", {className: "row level3"}, 
            React.createElement("div", {className: "row"}, 
              React.createElement("div", {className: "col-md-3"}, 
                React.createElement("h1", null, "周报"), 
                React.createElement("p", null, "目前共", this.state.quant, "个需求"), 
                React.createElement(ActionButton, {text: "加一个需求", onAction: this.addToQuant.bind(this, 1)}), 
                React.createElement(ActionButton, {text: "减一个需求", onAction: this.addToQuant.bind(this, -1)})
              ), 
              React.createElement("div", {className: "col-md-3"}, 
                React.createElement("form", null, 
                  React.createElement("div", {className: "form-group"}, 
                    React.createElement("input", {className: "form-control", type: "text", onChange: this.handleChange, placeholder: "姓名", ref: "userName"})
                  ), 
                  React.createElement("a", {className: "btn btn-default", href: this.mailTo()}, "发送邮件")
                )
              )
            ), 
            React.createElement(RequirementsList, {total: this.state.quant})
          )
      );
    }
});

var RequirementsList = React.createClass({displayName: "RequirementsList",
    getInitialState: function () {
        return {
            listPreview: [],
        };
    },
    updateListPreview: function (i) {
        var that = this;
        return function (component) {
            var tmp = that.state.listPreview.slice();
            tmp[i] = component;
            that.setState({
                listPreview: tmp
            });
        };
    },
    render: function() {
        // Components are composable
        var reqComponents = [];
        for (var i = 0, len = this.props.total; i < len; i++) {
            reqComponents.push(React.createElement(Requirement, {onPreviewRendered: this.updateListPreview(i), key: i, index: i+1}));
        }

        return (
            React.createElement("div", {className: "row level2"}, 
              React.createElement("div", {className: "col-md-6 to-do-done"}, 
                React.createElement("h2", null, "业务需求"), 
                reqComponents
              ), 
              React.createElement("div", {className: "col-md-6 preview"}, 
                React.createElement("h2", null, "预览"), 
                React.createElement("div", {className: "markdown-body"}, 
                  this.state.listPreview.slice(0, this.props.total)
                )
              )
            )
        );
    }
});

var Requirement = React.createClass({displayName: "Requirement",
    getInitialState: function () {
        return {
            title: '',
            progress: '',
            task: '',
            wiki: '',
            target: '',
            thisWeek: '',
            risk: ''
        };
    },
    handleChange: function () {
        var that = this;
        this.setState({
            title: that.props.index + '. ' + React.findDOMNode(this.refs.title).value,
            progress: React.findDOMNode(this.refs.progress).value,
            task: React.findDOMNode(this.refs.task).value,
            wiki: React.findDOMNode(this.refs.wiki).value,
            target: React.findDOMNode(this.refs.target).value,
            thisWeek: React.findDOMNode(this.refs.thisWeek).value,
            risk: React.findDOMNode(this.refs.risk).value
        }, function () {
            that.props.onPreviewRendered(this.renderPreview());
        });
    },
    renderPreview: function () {
        function createMarkup(component) {
            return {__html: converter.makeHtml(component.toString())};
        }

        function createLinkMarkup(component) {
            var raw = component.toString();
            return {__html: converter.makeHtml('['+raw+']('+raw+')')};
        }

        function createItem(value, key) {
            var nameDict = {
                progress: '关键时间点和进度',
                task: '需求Task',
                wiki: '需求Wiki',
                target: '需求目标或解决的问题',
                thisWeek: '本周开发内容',
                risk: '问题或风险'
            }
            if (key === 'title') {
                return React.createElement("h2", {key: key}, value);
            } else if (key === 'task' || key === 'wiki') {
                // Special treat for links
                return (
                    React.createElement("div", {key: key}, 
                      React.createElement("h3", null, nameDict[key]), 
                      React.createElement("div", {dangerouslySetInnerHTML: createLinkMarkup(value)})
                    )
                );
            } else {
                return (
                    React.createElement("div", {key: key}, 
                      React.createElement("h3", null, nameDict[key]), 
                      React.createElement("div", {dangerouslySetInnerHTML: createMarkup(value)})
                    )
                );
            }
        }

        // 注意{}里面的是JavaScript代码; Juicer/Handlebars的辅助函数是经过裁剪的函数
        return (
            React.createElement("div", {key: this.props.key}, 
              _.chain(this.state).pick(_.identity).map(createItem).value()
            )
        );
    },
    render: function () {
        return (
            React.createElement("form", {className: "req"}, 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "需求标题"), 
                React.createElement("input", {className: "form-control", type: "text", onChange: this.handleChange, defaultValue: this.state.title, ref: "title"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "关键时间点和进度"), 
                React.createElement("textarea", {className: "form-control", rows: "3", onChange: this.handleChange, defaultValue: this.state.progress, ref: "progress"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "需求Task"), 
                React.createElement("input", {className: "form-control", type: "text", onChange: this.handleChange, defaultValue: this.state.task, ref: "task"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "需求Wiki"), 
                React.createElement("input", {className: "form-control", type: "text", onChange: this.handleChange, defaultValue: this.state.wiki, ref: "wiki"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "需求目标或解决的问题"), 
                React.createElement("input", {className: "form-control", type: "text", onChange: this.handleChange, defaultValue: this.state.target, ref: "target"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "本周开发内容"), 
                React.createElement("textarea", {className: "form-control", rows: "3", onChange: this.handleChange, defaultValue: this.state.thisWeek, ref: "thisWeek"})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "问题或风险"), 
                React.createElement("textarea", {className: "form-control", rows: "3", onChange: this.handleChange, defaultValue: this.state.risk, ref: "risk"})
              )
            )
        );
    }
});

var ActionButton = React.createClass({displayName: "ActionButton",
    render: function() {
      return (
        React.createElement("button", {className: "btn btn-default", onClick: this.props.onAction}, this.props.text)
      );
    }
});

// Mock-up data
var REQUIREMENTS = [
    {
        title: '[旅游B端] TBMS - 标签管理系统需求',
        progress: '开发联调完成，待上线（90%）',
        task: 'http://task.sankuai.com/browse/HFE-285',
        wiki: 'http://wiki.sankuai.com/pages/viewpage.action?pageId=165350330',
        target: '通过建立标签管理系统方便标签的管理',
        thisWeek: '需求变更，增加编辑删除、图片上传等功能，BUGFIX',
        risk: '暂无'
    },
    {
        title: '[旅游B端] TBMS - 5.6新版频道页下场景运营后台',
        progress: '联调完成，待测试',
        task: '',
        wiki: '',
        target: '为了配合场景设计，需要有能够对场景进行配置，在前端展示上更符合场景运营策略的后台',
        thisWeek: '- POI配置页面新需求开发',
        risk: '后续BUG修复可能需要移交给赵帅'
    }
];

React.render(
  React.createElement(WeeklyReportComposer, {defaultNum: 1}),
  document.getElementById('content')
);
