export default function DivRow({ children }) {
    return (
      <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',gap: '10px' }}>
        {children}
      </div>
    );
  }