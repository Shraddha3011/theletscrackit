import TextBlock from '../blocks/TextBlock'

import CodeBlock from '../blocks/CodeBlock'

import QuizBlock from '../blocks/QuizBlock'

import TaskBlock from '../blocks/TaskBlock'

import VisualizerBlock from '../blocks/VisualizerBlock'

import ExecutionPlayer from '../runtime/ExecutionPlayer'

export default function LessonRenderer({
  blocks,
}) {

  if (!blocks?.length) {

    return null
  }

  return (

    <div className="space-y-10">

      {blocks.map((block) => {

        let parsedData = {}

        try {

          parsedData =
            JSON.parse(block.data)

        } catch (e) {

          console.log(e)
        }

        switch (block.type) {

          case 'TEXT':

            return (

              <TextBlock

                key={block.id}

                data={parsedData}

              />
            )

          case 'CODE':

            return (

              <CodeBlock

                key={block.id}

                data={parsedData}

              />
            )

          case 'QUIZ':

            return (

              <QuizBlock

                key={block.id}

                data={parsedData}

              />
            )

          case 'TASK':

            return (

              <TaskBlock

                key={block.id}

                data={parsedData}

              />
            )

          case 'PROJECT_STEP':

            return (

              <TaskBlock

                key={block.id}

                data={parsedData}

              />
            )

          case 'MEMORY_VISUALIZER':

            return (

              <VisualizerBlock

                key={block.id}

                data={parsedData}

              />
            )

          case 'RUNTIME':

            return (

              <ExecutionPlayer

                key={block.id}

                lesson={parsedData}

              />
            )

          default:

            return null
        }
      })}

    </div>
  )
}
