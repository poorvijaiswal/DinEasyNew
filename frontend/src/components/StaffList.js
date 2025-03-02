import React from "react";

const StaffList = ({ staff, onEdit, onDelete }) => {
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">Staff List</h3>
      <table className="w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Role</th>
            <th className="border p-2">Restaurant</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {staff.length > 0 ? (
            staff.map((staffMember) => (
              <tr key={staffMember.staff_id} className="border">
                <td className="border p-2">{staffMember.name}</td>
                <td className="border p-2">{staffMember.role}</td>
                <td className="border p-2">{staffMember.restaurant_name}</td>
                <td className="border p-2">
                  <button
                    onClick={() => onEdit(staffMember)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(staffMember.staff_id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center p-3 text-gray-600">
                No staff members found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StaffList;
