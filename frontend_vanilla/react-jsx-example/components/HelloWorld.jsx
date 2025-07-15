import React from 'react';

// 函数式组件示例
const HelloWorld = ({ name }) => {
  // 状态管理示例
  const [count, setCount] = React.useState(0);
  
  // 生命周期副作用示例
  React.useEffect(() => {
    console.log(`组件加载完成，当前计数: ${count}`);
    
    // 组件卸载时的清理操作
    return () => {
      console.log('组件卸载');
    };
  }, [count]);
  
  // 事件处理函数
  const handleClick = () => {
    setCount(prevCount => prevCount + 1);
  };
  
  return (
    <div className="hello-world-container">
      <h1>
        你好，{name || '世界'}!
      </h1>
      <p>这是一个使用React JSX创建的组件。</p>
      
      <div className="counter">
        <p>点击次数: {count}</p>
        <button onClick={handleClick}>
          点击增加
        </button>
      </div>
      
      {/* 条件渲染示例 */}
      {count > 5 && (
        <p className="celebration">
          哇！你已经点击了超过5次！🎉
        </p>
      )}
    </div>
  );
};

// 类组件示例
class ClassComponentExample extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: null
    };
  }
  
  componentDidMount() {
    // 模拟API请求
    setTimeout(() => {
      this.setState({
        isLoading: false,
        data: '这是从API获取的数据'
      });
    }, 1500);
  }
  
  render() {
    const { isLoading, data } = this.state;
    
    return (
      <div className="class-component">
        <h2>类组件示例</h2>
        {isLoading ? (
          <p>加载中...</p>
        ) : (
          <p>{data}</p>
        )}
      </div>
    );
  }
}

export { HelloWorld, ClassComponentExample };  