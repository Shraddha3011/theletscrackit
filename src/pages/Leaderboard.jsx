// import { useEffect, useState } from 'react'
// import { getLeaderboard } from '../api/quizApi'
// import PageWrapper from '../components/layout/PageWrapper'

// export default function Leaderboard() {
//   const [users, setUsers] = useState([])

//   useEffect(() => {
//     getLeaderboard().then(({ data }) => {
//       setUsers(data.data || [])
//     })
//   }, [])

//   return (
//     <PageWrapper>
//       <div className="page-container py-10">
//         <div className="max-w-3xl mx-auto">
//           <p className="section-label mb-3">Top learners</p>
//           <h1 className="font-display font-bold text-4xl text-primary">Leaderboard</h1>

//           <div className="mt-8 space-y-3">
//             {users.length > 0 ? (
//               users.map((u, i) => (
//                 <div
//                   key={u.id}
//                   className="card p-4 flex items-center justify-between gap-4"
//                 >
//                   <span className="font-medium text-primary">
//                     #{i + 1} {u.username}
//                   </span>
//                   <strong className="text-brand-400">{u.xpPoints} XP</strong>
//                 </div>
//               ))
//             ) : (
//               <div className="card p-8 text-center">
//                 <p className="text-secondary">No leaderboard data yet.</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </PageWrapper>
//   )
// }
