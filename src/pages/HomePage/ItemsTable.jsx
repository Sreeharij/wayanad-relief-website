const ItemsTable = ({data}) => {

  const updatedData = [];

  for (const el of data) {
    if (el.status == "closed") continue;
    for (const item of el.items) {
      updatedData.push({
        itemName: item.itemName,
        quantity: item.itemQuantity,
        description: el.description
      })
    }
  }

  return (
    <table>
      <thead>
        <tr style={{background: "#f0f0f0"}}>
          <th>Sl.No</th>
          <th>Item</th>
          <th>Quantity</th>
          <th>Remark</th>
        </tr>
      </thead>
      <tbody>
        {updatedData.map((item, index) => {
          return (
            <tr>
              <td>{index+1}.</td>
              <td>{item.itemName}</td>
              <td>{item.quantity}</td>
              <td>{item.description}</td>
            </tr>
          );
        })}
        
      </tbody>
    </table>
  )
}

export default ItemsTable;
