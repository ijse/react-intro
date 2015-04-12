var converter = new Showdown.converter();

/*
 * Step 1: break the UI into a component hierarchy
 * - WeeklyReportComposer
 *   - RequirementsList
 *     - Requirement
 */

var WeeklyReportComposer = React.createClass({
    render: function() {
      return (
          <div className="row">
            <h1>周报</h1>
            <RequirementsList data={this.props.reqs} />
          </div>
      );
    }
});

var RequirementsList = React.createClass({
    render: function() {
        var reqComponents = this.props.data.map(function (req, index) {
            return (
                <Requirement data={req} key={index}/>
            );
        });

        return (
            <div>
              <div className="col-md-6 to-do-done">
                <h2>业务需求</h2>
                {reqComponents}
              </div>
              <div className="col-md-6 preview">
                <h2>预览</h2>
              </div>
            </div>
        );
    }
});

var Requirement = React.createClass({
    render: function () {
        return (
            <form>
              <div className="form-group">
                <label>需求标题</label>
                <input className="form-control" type="text" value={this.props.data.title}/>
              </div>
              <div className="form-group">
                <label>关键时间点和进度</label>
                <input className="form-control" type="text" value={this.props.data.progress}/>
              </div>
              <div className="form-group">
                <label>需求Task</label>
                <input className="form-control" type="text" value={this.props.data.task}/>
              </div>
              <div className="form-group">
                <label>需求Wiki</label>
                <input className="form-control" type="text" value={this.props.data.wiki}/>
              </div>
              <div className="form-group">
                <label>需求目标或解决的问题</label>
                <input className="form-control" type="text" value={this.props.data.target}/>
              </div>
              <div className="form-group">
                <label>本周开发内容</label>
                <textarea className="form-control" rows="8" value={this.props.data.thisWeek}/>
              </div>
              <div className="form-group">
                <label>问题或风险</label>
                <input className="form-control" type="text" value={this.props.data.risk}/>
              </div>
            </form>
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
  <WeeklyReportComposer reqs={REQUIREMENTS}/>,
  document.getElementById('content')
);
