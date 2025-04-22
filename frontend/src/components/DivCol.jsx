export default function DivCol({ children }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center',gap: '10px' }}>
        {children}
      </div>
    );
  }