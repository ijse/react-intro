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
            quant: this.props.defaultNum
        }
    },
    addToQuant: function (delta) {
        var newQuant = this.state.quant + delta;
        this.setState({
            quant: newQuant <= 0 ? 1 : newQuant
        });
    },
    render: function() {
      return (
          React.createElement("div", {className: "row"}, 
            React.createElement("h1", null, "周报"), 
            React.createElement("p", null, "目前共", this.state.quant, "个需求"), 
            React.createElement("button", {className: "btn btn-default", onClick: this.addToQuant.bind(this, 1)}, "加一个需求"), 
            React.createElement("button", {className: "btn btn-default", onClick: this.addToQuant.bind(this, -1)}, "减一个需求"), 
            React.createElement(RequirementsList, {total: this.state.quant})
          )
      );
    }
});

var RequirementsList = React.createClass({displayName: "RequirementsList",
    render: function() {
        var reqComponents = [];
        for (var i = 0, len = this.props.total; i < len; i++) {
            reqComponents.push(React.createElement(Requirement, {key: i}));
        }

        return (
            React.createElement("div", null, 
              React.createElement("div", {className: "col-md-6 to-do-done"}, 
                React.createElement("h2", null, "业务需求"), 
                reqComponents
              ), 
              React.createElement("div", {className: "col-md-6 preview"}, 
                React.createElement("h2", null, "预览")
              )
            )
        );
    }
});

var Requirement = React.createClass({displayName: "Requirement",
    getInitialState: function () {
        return {
            title: '[旅游B端] TBMS - 标签管理系统需求',
            progress: '开发联调完成，待上线（90%）',
            task: 'http://task.sankuai.com/browse/HFE-285',
            wiki: 'http://wiki.sankuai.com/pages/viewpage.action?pageId=165350330',
            target: '通过建立标签管理系统方便标签的管理',
            thisWeek: '需求变更，增加编辑删除、图片上传等功能，BUGFIX',
            risk: '暂无'
        };
    },
    render: function () {
        return (
            React.createElement("form", null, 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "需求标题"), 
                React.createElement("input", {className: "form-control", type: "text", defaultValue: this.state.title})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "关键时间点和进度"), 
                React.createElement("input", {className: "form-control", type: "text", defaultValue: this.state.progress})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "需求Task"), 
                React.createElement("input", {className: "form-control", type: "text", defaultValue: this.state.task})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "需求Wiki"), 
                React.createElement("input", {className: "form-control", type: "text", defaultValue: this.state.wiki})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "需求目标或解决的问题"), 
                React.createElement("input", {className: "form-control", type: "text", defaultValue: this.state.target})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "本周开发内容"), 
                React.createElement("textarea", {className: "form-control", rows: "8", defaultValue: this.state.thisWeek})
              ), 
              React.createElement("div", {className: "form-group"}, 
                React.createElement("label", null, "问题或风险"), 
                React.createElement("input", {className: "form-control", type: "text", defaultValue: this.state.risk})
              )
            )
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
