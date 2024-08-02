const ItemsTable = () => {
  return (
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Quantity</th>
          <th>Remark</th>
          <th>status</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Water</td>
          <td>10</td>
          <td>No Remarks</td>
          <td>pending</td>
        </tr>
        <tr>
          <td>Food</td>
          <td>20</td>
          <td>No Remarks</td>
          <td>pending</td>
        </tr>
        <tr>
          <td>Clothes</td>
          <td>30</td>
          <td>No Remarks</td>
          <td>pending</td>
        </tr>
      </tbody>
    </table>
  )
}

export default ItemsTable;
