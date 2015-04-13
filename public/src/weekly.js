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
          <div className="row level3">
            <div className="row">
              <div className="col-md-3">
                <h1>周报</h1>
                <p>目前共{this.state.quant}个需求</p>
                <button className="btn btn-default" onClick={this.addToQuant.bind(this, 1)}>加一个需求</button>
                <button className="btn btn-default" onClick={this.addToQuant.bind(this, -1)}>减一个需求</button>
              </div>
              <div className="col-md-3">
                <form>
                  <div className="form-group">
                    <input className="form-control" type="text" onChange={this.handleChange} placeholder="姓名" ref="userName"/>
                  </div>
                  <a className="btn btn-default" href={this.mailTo()}>发送邮件</a>
                </form>
              </div>
            </div>
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
        // Components are composable
        var reqComponents = [];
        for (var i = 0, len = this.props.total; i < len; i++) {
            reqComponents.push(<Requirement onPreviewRendered={this.updateListPreview(i)} key={i}/>);
        }

        return (
            <div className="row level2">
              <div className="col-md-6 to-do-done">
                <h2>业务需求</h2>
                {reqComponents}
              </div>
              <div className="col-md-6 preview">
                <h2>预览</h2>
                <div className="markdown-body">
                  {this.state.listPreview}
                </div>
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
              <h2>{this.state.title}</h2>
              <h3>关键时间点和进度</h3>
              <div dangerouslySetInnerHTML={createMarkup(this.state.progress)}/>
              <h3>需求Task</h3>
              <div dangerouslySetInnerHTML={createLinkMarkup(this.state.task)}/>
              <h3>需求Wiki</h3>
              <div dangerouslySetInnerHTML={createLinkMarkup(this.state.wiki)}/>
              <h3>需求目标或解决的问题</h3>
              <div dangerouslySetInnerHTML={createMarkup(this.state.target)}/>
              <h3>本周开发内容</h3>
              <div dangerouslySetInnerHTML={createMarkup(this.state.thisWeek)}/>
              <h3>问题或风险</h3>
              <div dangerouslySetInnerHTML={createMarkup(this.state.risk)}/>
            </div>
        );
    },
    render: function () {
        return (
            <form className="req">
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
