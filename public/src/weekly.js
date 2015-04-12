var converter = new Showdown.converter();

/*
 * Step 1: break the UI into a component hierarchy
 * - WeeklyReportComposer
 *   - RequirementsList
 *     - Requirement
 */

var WeeklyReportComposer = React.createClass({
    getInitialState: function () {
        return {
            quant: this.props.defaultNum
        };
    },
    addToQuant: function (delta) {
        var newQuant = this.state.quant + delta;
        this.setState({
            quant: newQuant <= 0 ? 1 : newQuant
        });
    },
    render: function() {
      return (
          <div className="row">
            <h1>周报</h1>
            <p>目前共{this.state.quant}个需求</p>
            <button className="btn btn-default" onClick={this.addToQuant.bind(this, 1)}>加一个需求</button>
            <button className="btn btn-default" onClick={this.addToQuant.bind(this, -1)}>减一个需求</button>
            <RequirementsList total={this.state.quant} />
          </div>
      );
    }
});

var RequirementsList = React.createClass({
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
        var reqComponents = [];
        for (var i = 0, len = this.props.total; i < len; i++) {
            reqComponents.push(<Requirement onPreviewRendered={this.updateListPreview(i)} key={i}/>);
        }

        var date = new Date();
        var to = 'hb.rd.fe@meituan.com';
        var cc = 'hb@meituan.com,mobile@meituan.com';
        var subject = encodeURIComponent('酒店事业部-前端研发组-周报-'+date.getFullYear()+date.getMonth()+date.getDate());

        return (
            <div>
              <div className="col-md-6 to-do-done">
                <h2>业务需求</h2>
                {reqComponents}
              </div>
              <div className="col-md-6 preview">
                <h2>预览</h2>
                <div id="result">
                  {this.state.listPreview}
                </div>
                <a className="btn btn-default" href={"mailto:"+to+"?"+"subject="+subject+"&cc="+cc}>发送邮件</a>
              </div>
            </div>
        );
    }
});

var Requirement = React.createClass({
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
            title: React.findDOMNode(this.refs.title).value,
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

        return (
            <div key={this.props.key}>
              <h3>{this.state.title}</h3>
              <h4>关键时间点和进度</h4>
              <div dangerouslySetInnerHTML={createMarkup(this.state.progress)}/>
              <h4>需求Task</h4>
              <div dangerouslySetInnerHTML={createLinkMarkup(this.state.task)}/>
              <h4>需求Wiki</h4>
              <div dangerouslySetInnerHTML={createLinkMarkup(this.state.wiki)}/>
              <h4>需求目标或解决的问题</h4>
              <div dangerouslySetInnerHTML={createMarkup(this.state.target)}/>
              <h4>本周开发内容</h4>
              <div dangerouslySetInnerHTML={createMarkup(this.state.thisWeek)}/>
              <h4>问题或风险</h4>
              <div dangerouslySetInnerHTML={createMarkup(this.state.risk)}/>
            </div>
        );
    },
    render: function () {
        return (
            <form>
              <div className="form-group">
                <label>需求标题</label>
                <input className="form-control" type="text" onChange={this.handleChange} defaultValue={this.state.title} ref="title"/>
              </div>
              <div className="form-group">
                <label>关键时间点和进度</label>
                <textarea className="form-control" rows="3" onChange={this.handleChange} defaultValue={this.state.progress} ref="progress"/>
              </div>
              <div className="form-group">
                <label>需求Task</label>
                <input className="form-control" type="text" onChange={this.handleChange} defaultValue={this.state.task} ref="task"/>
              </div>
              <div className="form-group">
                <label>需求Wiki</label>
                <input className="form-control" type="text" onChange={this.handleChange} defaultValue={this.state.wiki} ref="wiki"/>
              </div>
              <div className="form-group">
                <label>需求目标或解决的问题</label>
                <input className="form-control" type="text" onChange={this.handleChange} defaultValue={this.state.target} ref="target"/>
              </div>
              <div className="form-group">
                <label>本周开发内容</label>
                <textarea className="form-control" rows="3" onChange={this.handleChange} defaultValue={this.state.thisWeek} ref="thisWeek"/>
              </div>
              <div className="form-group">
                <label>问题或风险</label>
                <textarea className="form-control" rows="3" onChange={this.handleChange} defaultValue={this.state.risk} ref="risk"/>
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
  <WeeklyReportComposer defaultNum={1}/>,
  document.getElementById('content')
);
