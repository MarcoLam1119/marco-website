function ContainerGrid({children}) {
    return (
      <container-grid style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {children}
      </container-grid>
    );
}
export default ContainerGrid;