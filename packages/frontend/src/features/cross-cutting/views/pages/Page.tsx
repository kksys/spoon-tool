import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { FC, memo, ReactNode } from "react";

interface IPageProps {
  fixedLayout?: boolean
  children?: ReactNode
}

const useStyles = makeStyles({
  container: {
    position: 'relative',
    flex: "1",
    display: "grid",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: '100%',
    gridTemplateColumns: '1fr',
    overflow: 'scroll',
  },
  content: {
    position: 'absolute',
    boxSizing: 'border-box',
    flex: "1",
    padding: "12px",
    display: "grid",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: '100%',
    gridTemplateColumns: '1fr',
  },
  fixedLayoutContainer: {
    overflow: 'hidden'
  },
  fixedLayout: {
    top: 0,
    bottom: 0
  }
})

export const Page: FC<IPageProps> = memo(({ fixedLayout, children }) => {
  const styles = useStyles()

  return (
    <div className={mergeClasses(styles.container, fixedLayout ? styles.fixedLayoutContainer : undefined)}>
      <div className={mergeClasses(styles.content, fixedLayout ? styles.fixedLayout : undefined)}>
        { children }
      </div>
    </div>
  )
})

Page.displayName = 'Page'
