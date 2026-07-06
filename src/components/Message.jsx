const Message = ({ type = 'error', children }) => (
  <div className={`alert alert-${type}`} role="alert">
    {children}
  </div>
);

export default Message;
